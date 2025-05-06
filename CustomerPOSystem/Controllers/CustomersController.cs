using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CustomerPOSystem.Models;

public class CustomersController : Controller
{
    private readonly CustomerDbContext _context;

    public CustomersController(CustomerDbContext context)
    {
        _context = context;
    }

    // GET: Customers
    public async Task<IActionResult> Index()
    {
        var customers = await _context.Customers
            .Where(c => c.IsActive)
            .ToListAsync();

        return View(customers);
    }

    // GET: Customers/Details/5
    public async Task<IActionResult> Details(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var customer = await _context.Customers
            .FirstOrDefaultAsync(m => m.Id == id);
        if (customer == null)
        {
            return NotFound();
        }

        return View(customer);
    }

    // GET: Customers/Create
    public IActionResult Create()
    {
        return View();
    }
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Customer customer)
    {
        var existingCustomerByMobile = await _context.Customers
            .FirstOrDefaultAsync(c => c.MobileNumber == customer.MobileNumber && c.IsActive == true);

        if (existingCustomerByMobile != null)
        {
            return Json(new { success = false, message = "Mobile number already exists." });
        }

        var existingCustomerByName = await _context.Customers
            .FirstOrDefaultAsync(c => c.FirstName == customer.FirstName && c.LastName == customer.LastName && c.IsActive == true);

        if (existingCustomerByName != null)
        {
            return Json(new { success = false, message = "Customer with the same name already exists." });
        }

        if (ModelState.IsValid)
        {
            customer.DateCreated = DateTime.UtcNow;
            customer.Timestamp = DateTime.UtcNow;

            _context.Add(customer);
            await _context.SaveChangesAsync();

            return Json(new { success = true, message = "Customer created successfully." });
        }

        return Json(new { success = false, message = "Model is not valid." });
    }

    // GET: Customers/Edit/5
    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var customer = await _context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound();
        }

        return View(customer);
    }
    [HttpPut]
    public async Task<IActionResult> Edit(int id, [FromBody] Customer customer)
    {
        if (id != customer.Id)
            return NotFound();

        var existingCustomerByMobile = await _context.Customers
            .FirstOrDefaultAsync(c => c.MobileNumber == customer.MobileNumber && c.Id != customer.Id && c.IsActive == true);

        if (existingCustomerByMobile != null)
        {
            return Json(new { success = false, message = "Mobile number is already in use by another customer." });
        }
        var existingCustomerByName = await _context.Customers
            .FirstOrDefaultAsync(c =>
                c.FirstName == customer.FirstName &&
                c.LastName == customer.LastName &&
                c.Id != customer.Id && c.IsActive == true);

        if (existingCustomerByName != null)
        {
            return Json(new { success = false, message = "Customer with the same name already exists." });
        }

        if (ModelState.IsValid)
        {
            try
            {
                var existingCustomer = await _context.Customers.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
                if (existingCustomer == null)
                    return NotFound();

                customer.DateCreated = existingCustomer.DateCreated;
                customer.Timestamp = DateTime.UtcNow;

                _context.Update(customer);
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Customer updated successfully." });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(customer.Id))
                    return NotFound();
                else
                    throw;
            }
        }

        return BadRequest(ModelState);
    }


    private bool CustomerExists(int id)
    {
        return _context.Customers.Any(e => e.Id == id);
    }
}
