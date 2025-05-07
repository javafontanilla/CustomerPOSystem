using System;
using System.ComponentModel.DataAnnotations;
namespace CustomerPOSystem.Helper
{
    public class TomorrowOrLaterAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value is DateOnly date)
            {
                var tomorrow = DateOnly.FromDateTime(DateTime.Today.AddDays(1));

                if (date < tomorrow)
                {
                    return new ValidationResult(ErrorMessage ?? "Date must be tomorrow or later.");
                }

                return ValidationResult.Success;
            }

            return new ValidationResult(ErrorMessage ?? "Invalid date value.");
        }
    }
}
