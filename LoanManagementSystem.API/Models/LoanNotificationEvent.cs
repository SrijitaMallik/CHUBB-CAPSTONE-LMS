namespace LoanManagementSystem.API.Models
{
    public class LoanNotificationEvent
    {
        public int LoanId { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = "";
        public string Message { get; set; } = "";
        public bool NotifyCustomer { get; set; } = true;
        public bool NotifyLoanOfficers { get; set; } = false;
        public bool NotifyAdmins { get; set; } = false;
    }
}
