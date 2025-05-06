using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CustomerPOSystem.Models;

public class Sku
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Name is required.")]
    public string Name { get; set; } = null!;

    [Required(ErrorMessage = "Code is required.")]
    public string Code { get; set; } = null!;

    [Required(ErrorMessage = "Unit Price is required.")]
    [Range(0, double.MaxValue, ErrorMessage = "Unit Price must be a positive value.")]
    public decimal UnitPrice { get; set; }
    [JsonIgnore]
    public DateTime DateCreated { get; set; }

    [Required]
    public string CreatedBy { get; set; } = null!;

    public DateTime Timestamp { get; set; }

    [Required]
    public string UserId { get; set; } = null!;

    public bool IsActive { get; set; }

    public string? ImagePath { get; set; }
}
