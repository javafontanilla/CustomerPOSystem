using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CustomerPOSystem.Models
{
    public partial class Customer
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "First Name is required.")]
        public string FirstName { get; set; } = null!;

        [Required(ErrorMessage = "Last Name is required.")]
        public string LastName { get; set; } = null!;
        public string FullName => $"{FirstName} {LastName}";
        [Required(ErrorMessage = "Mobile number is required.")]
        [RegularExpression(@"^[1-9]{1}[0-9]{9}$", ErrorMessage = "Mobile number must be exactly 10 digits and numeric only")]
        public long MobileNumber { get; set; }
        [Required]
        public string City { get; set; } = null!;

        public string Long { get; set; } = null!;
        public string Lat { get; set; } = null!;

        [DataType(DataType.Date)]
        public DateTime DateCreated { get; set; }
        public string CreatedBy { get; set; } = null!;

        public DateTime Timestamp { get; set; }
        public string UserId { get; set; } = null!;

        public bool IsActive { get; set; }
    }
}
