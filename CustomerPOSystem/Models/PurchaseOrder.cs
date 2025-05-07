using CustomerPOSystem.Helper;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CustomerPOSystem.Models
{
    public partial class PurchaseOrder
    {
        public int Id { get; set; }

        [Required]
        public int CustomerId { get; set; }

        public Customer Customer { get; set; } = null!;

        [Required(ErrorMessage = "Date of Delivery is required.")]
        [TomorrowOrLater]
        public DateOnly DateOfDelivery { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = null!;

        [Range(0, double.MaxValue, ErrorMessage = "Amount due must be a positive value.")]
        public decimal AmountDue { get; set; }

        public DateTime DateCreated { get; set; }

        [Required]
        public string CreatedBy { get; set; } = null!;

        public DateTime Timestamp { get; set; }

        [Required]
        public string UserId { get; set; } = null!;

        public bool IsActive { get; set; }

        public List<PurchaseItem> Items { get; set; } = new(); 
    }

    public class PurchaseOrderViewModel
    {
        public int Id { get; set; }
        public int CustomerId { get; set; } = 0;
        public string CustomerName { get; set; } = string.Empty;
        public DateOnly DateOfDelivery { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal AmountDue { get; set; }
    }
}
