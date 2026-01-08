using LoanManagementSystem.API.Data;
using LoanManagementSystem.API.DTOs;
using LoanManagementSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LoanManagementSystem.API.Controllers
{
    [Authorize(Roles = "Customer")]
    [ApiController]
    [Route("api/loans")]
    public class LoanController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LoanController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyLoan(LoanApplyDTO dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var loanType = await _context.LoanTypes
                .FirstOrDefaultAsync(x => x.LoanTypeId == dto.LoanTypeId);

            if (loanType == null)
                return BadRequest("Invalid Loan Type");
            
            if (dto.TenureMonths > loanType.MaxTenureMonths)
                return BadRequest($"Maximum tenure allowed for {loanType.LoanTypeName} is {loanType.MaxTenureMonths} months.");

            if (dto.TenureMonths <= 0)
                return BadRequest("Invalid tenure selected.");

            if (dto.LoanAmount < loanType.MinAmount || dto.LoanAmount > loanType.MaxAmount)
                return BadRequest($"Loan amount must be between {loanType.MinAmount} and {loanType.MaxAmount}");


            var application = new LoanApplication
            {
                CustomerId = userId,
                LoanTypeId = dto.LoanTypeId,
                LoanAmount = dto.LoanAmount,
                TenureMonths = dto.TenureMonths,
                MonthlyIncome = dto.MonthlyIncome,
                Status = "Pending"
            };

            _context.LoanApplications.Add(application);
            await _context.SaveChangesAsync();

            // ✅ Notify Customer
            await LoanNotificationQueue.Channel.Writer.WriteAsync(
                new LoanNotificationEvent
                {
                    LoanId = application.LoanApplicationId,
                    UserId = userId,
                    Title = "Loan Applied",
                    Message = "Your loan application has been submitted successfully and is under review.",
                    NotifyCustomer = true,
                    NotifyLoanOfficers = false,
                    NotifyAdmins = false
                });

            // ✅ Notify Loan Officers
            await LoanNotificationQueue.Channel.Writer.WriteAsync(
                new LoanNotificationEvent
                {
                    LoanId = application.LoanApplicationId,
                    UserId = 0, // Not specific to one user
                    Title = "New Loan Application",
                    Message = $"New loan application #{application.LoanApplicationId} for ${dto.LoanAmount} has been submitted.",
                    NotifyCustomer = false,
                    NotifyLoanOfficers = true,
                    NotifyAdmins = false
                });

            // ✅ Notify Admins
            await LoanNotificationQueue.Channel.Writer.WriteAsync(
                new LoanNotificationEvent
                {
                    LoanId = application.LoanApplicationId,
                    UserId = 0,
                    Title = "New Loan Application",
                    Message = $"New loan application #{application.LoanApplicationId} for ${dto.LoanAmount} requires attention.",
                    NotifyCustomer = false,
                    NotifyLoanOfficers = false,
                    NotifyAdmins = true
                });

            return Ok(new { message = "Loan applied successfully" });
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyLoans()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var loans = await _context.LoanApplications
                .Include(l => l.LoanType)
                .Where(l => l.CustomerId == userId)     // ← remove Approved filter
                .Select(l => new
                {
                    LoanId = l.LoanApplicationId,
                    LoanType = l.LoanType!.LoanTypeName,
                    Amount = l.LoanAmount,
                    Tenure = l.TenureMonths,
                    Emi = l.EmiAmount,
                    Status = l.Status
                })
                .ToListAsync();

            return Ok(loans);
        }



        [HttpPost("pay-emi/{loanId}")]
        public async Task<IActionResult> PayEmi(int loanId, decimal amount)
        {
            var loan = await _context.LoanApplications.FindAsync(loanId);
            if (loan == null) return NotFound();

            loan.OutstandingAmount -= amount;

            if (loan.OutstandingAmount <= 0)
            {
                loan.OutstandingAmount = 0;
                loan.Status = "Closed";   // 🔥 AUTO CLOSE
            }

            await _context.SaveChangesAsync();
            return Ok(loan);
        }


        [HttpGet("my-active-loans")]
        public async Task<IActionResult> MyActiveLoans()
        {
            var uid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var loans = await _context.LoanApplications
                .Where(l => l.CustomerId == uid && l.Status != "Closed")
                .ToListAsync();

            return Ok(loans);
        }

        [HttpGet("my-closed-loans")]
        public async Task<IActionResult> MyClosedLoans()
        {
            var uid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var loans = await _context.LoanApplications
                .Where(l => l.CustomerId == uid && l.Status == "Closed")
                .ToListAsync();

            return Ok(loans);
        }


    }
}
