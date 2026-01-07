using LoanManagementSystem.API.Data;
using LoanManagementSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LoanManagementSystem.API.Services
{
    public class LoanNotificationBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public LoanNotificationBackgroundService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            Console.WriteLine("Loan Notification Service STARTED");

            await foreach (var evt in LoanNotificationQueue.Channel.Reader.ReadAllAsync(stoppingToken))
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // Get target user IDs based on notification type
                var targetUserIds = new List<int>();

                if (evt.NotifyCustomer && evt.UserId > 0)
                {
                    targetUserIds.Add(evt.UserId);
                }

                if (evt.NotifyLoanOfficers)
                {
                    var loanOfficers = await db.Users
                        .Where(u => u.Role == "LoanOfficer" && u.IsActive)
                        .Select(u => u.UserId)
                        .ToListAsync();
                    targetUserIds.AddRange(loanOfficers);
                }

                if (evt.NotifyAdmins)
                {
                    var admins = await db.Users
                        .Where(u => u.Role == "Admin" && u.IsActive)
                        .Select(u => u.UserId)
                        .ToListAsync();
                    targetUserIds.AddRange(admins);
                }

                var loanExists = await db.LoanApplications
    .AnyAsync(l => l.LoanApplicationId == evt.LoanId);

                if (!loanExists)
                {
                    Console.WriteLine($"⚠ Invalid LoanId {evt.LoanId} – Notification skipped");
                    continue;
                }

                foreach (var userId in targetUserIds.Distinct())
                {
                    db.LoanNotifications.Add(new LoanNotification
                    {
                        LoanId = evt.LoanId,
                        UserId = userId,
                        Title = evt.Title,
                        Message = evt.Message
                    });
                }

                await db.SaveChangesAsync();
                Console.WriteLine($"NOTIFICATION => {evt.Title} for Loan {evt.LoanId} sent to {targetUserIds.Count} users");
            }
            }
        }
}
