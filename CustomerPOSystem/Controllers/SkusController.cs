using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CustomerPOSystem.Models;

public class SkusController : Controller
{
    private readonly CustomerDbContext _context;

    public SkusController(CustomerDbContext context)
    {
        _context = context;
    }

    // GET: Skus
    public async Task<IActionResult> Index()
    {
        var skus = await _context.Skus
            .Where(s => s.IsActive)
            .ToListAsync();

        return View(skus);
    }

    // GET: Skus/Details/5
    public async Task<IActionResult> Details(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var sku = await _context.Skus.FirstOrDefaultAsync(m => m.Id == id);
        if (sku == null)
        {
            return NotFound();
        }

        return View(sku);
    }

    [HttpGet]
    public async Task<IActionResult> GetSkus(string searchTerm, int page = 1)
    {
        var query = _context.Skus.AsQueryable();

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(s => s.Code.Contains(searchTerm) || s.Name.Contains(searchTerm));
        }

        var pageSize = 10;
        var skus = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var results = skus.Select(s => new {
            id = s.Id,
            imagePath = s.ImagePath,
            text = s.Code + " - " + s.Name,
            price = s.UnitPrice 
        });

        return Json(new
        {
            results = results,
            pagination = new { more = skus.Count == pageSize }
        });
    }



    // GET: Skus/Create
    public IActionResult Create()
    {
        return View();
    }


    [HttpPost]
    public async Task<IActionResult> Create([FromForm] Sku sku, IFormFile Image)
    {
        if (ModelState.IsValid)
        {
            var existingSKU = await _context.Skus
                .FirstOrDefaultAsync(c => c.Name == sku.Name && c.Code == sku.Code && c.IsActive == true);

            if (existingSKU != null)
            {
                return Json(new { success = false, message = "SKU name and code already exist." });
            }

            if (Image != null && Image.Length > 0)
            {
                var fileName = Path.GetFileNameWithoutExtension(Image.FileName);
                var fileExtension = Path.GetExtension(Image.FileName);
                var safeFileName = $"{fileName}_{Guid.NewGuid()}{fileExtension}";
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", safeFileName);

                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await Image.CopyToAsync(stream);
                }

                sku.ImagePath = $"/images/{safeFileName}";
            }

            sku.DateCreated = DateTime.UtcNow;
            sku.Timestamp = DateTime.UtcNow;

            _context.Add(sku);
            await _context.SaveChangesAsync();

            return Json(new { success = true, message = "SKU created successfully." });
        }

        return Json(new { success = false, message = "There was an error creating the SKU." });
    }



    // GET: Skus/Edit/5
    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var sku = await _context.Skus.FindAsync(id);
        if (sku == null)
        {
            return NotFound();
        }

        return View(sku);
    }
    [HttpPut]
    public async Task<IActionResult> Edit(int id, [FromForm] Sku sku, IFormFile Image)
    {
        if (id != sku.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            var duplicate = await _context.Skus
                .Where(s => s.Id != id && s.IsActive == true && s.Name == sku.Name && s.Code == sku.Code)
                .FirstOrDefaultAsync();

            if (duplicate != null)
            {
                return Json(new
                {
                    success = false,
                    message = $"An active SKU with the same {(duplicate.Name == sku.Name ? "Name" : "Code")} already exists."
                });
            }

            try
            {
                var existingSku = await _context.Skus.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);
                if (existingSku == null)
                {
                    return NotFound();
                }

                if (Image != null && Image.Length > 0)
                {

                    var imagePath = Path.Combine("wwwroot/images", Image.FileName);
                    using (var stream = new FileStream(imagePath, FileMode.Create))
                    {
                        await Image.CopyToAsync(stream);
                    }

                    sku.ImagePath = "/images/" + Image.FileName;
                }
                else
                {
                    sku.ImagePath = existingSku.ImagePath;
                }

                sku.DateCreated = existingSku.DateCreated;
                sku.Timestamp = DateTime.UtcNow;

                _context.Update(sku);
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "SKU updated successfully." });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SkuExists(sku.Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        return Json(new { success = false, message = "There was an error updating the SKU." });
    }



    private bool SkuExists(int id)
    {
        return _context.Skus.Any(e => e.Id == id);
    }
}
