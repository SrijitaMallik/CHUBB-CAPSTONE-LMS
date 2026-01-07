using LoanManagementSystem.API.Services;   // ✅ CORRECT
using Xunit;

namespace LMS_Testing
{
    public class EmiCalculatorServiceTests
    {
        private readonly EmiCalculatorService _service;

        public EmiCalculatorServiceTests()
        {
            _service = new EmiCalculatorService();
        }

        [Fact]
        public void CalculateEmi_Returns_Positive_Value()
        {
            var emi = _service.CalculateEmi(100000, 12, 10);
            Assert.True(emi > 0);
        }

        [Fact]
        public void CalculateEmi_SameInput_Returns_SameOutput()
        {
            var emi1 = _service.CalculateEmi(50000, 10, 9);
            var emi2 = _service.CalculateEmi(50000, 10, 9);

            Assert.Equal(emi1, emi2);
        }
    }
}
