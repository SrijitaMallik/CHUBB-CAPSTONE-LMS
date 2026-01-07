using LoanManagementSystem.API.Controllers;
using LoanManagementSystem.API.Data;
using LoanManagementSystem.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace LMS_Testing.Controllers
{
    public class AdminControllerTests
    {
        private AppDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }

        [Fact]
        public async Task PendingOfficers_ReturnsOk()
        {
            var context = GetDbContext();
            context.Users.Add(new User
            {
                FullName = "Officer",
                Email = "o@test.com",
                Role = "LoanOfficer",
                PasswordHash = "dummy",
                IsApproved = false,
                IsActive = false
            });
            await context.SaveChangesAsync();

            var controller = new AdminController(context);

            var result = await controller.PendingOfficers();

            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task ApproveOfficer_InvalidId_ReturnsNotFound()
        {
            var controller = new AdminController(GetDbContext());

            var result = await controller.ApproveOfficer(999);

            Assert.IsType<NotFoundResult>(result);
        }
    }
}
