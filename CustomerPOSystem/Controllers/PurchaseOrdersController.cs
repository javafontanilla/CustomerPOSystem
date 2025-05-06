using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CustomerPOSystem.Models;

namespace CustomerPOSystem.Controllers
{
    public class PurchaseOrdersController : Controller
    {
        private readonly CustomerDbContext _context;

        public PurchaseOrdersController(CustomerDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var purchaseOrders = await _context.PurchaseOrders
                .Include(po => po.Customer)
                .Select(po => new PurchaseOrderViewModel
                {
                    Id = po.Id,
                    CustomerId = po.Customer.Id,
                    CustomerName = po.Customer.FullName, 
                    DateOfDelivery = po.DateOfDelivery,
                    Status = po.Status,
                    AmountDue = po.AmountDue
                })
                .ToListAsync();

            return View(purchaseOrders);  
        }

        // GET: PurchaseOrders/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var purchaseOrder = await _context.PurchaseOrders
                .FirstOrDefaultAsync(m => m.Id == id);
            if (purchaseOrder == null)
            {
                return NotFound();
            }

            return View(purchaseOrder);
        }


        [HttpGet]
        public async Task<IActionResult> GetCustomers(string searchTerm, int page = 1)
        {
            var customersQuery = _context.Customers
           .Where(c => c.IsActive)  
           .AsQueryable();


            if (!string.IsNullOrEmpty(searchTerm))
            {
                customersQuery = customersQuery.Where(c =>
                    (c.FirstName + " " + c.LastName).Contains(searchTerm));
            }

            var customers = await customersQuery
                .Skip((page - 1) * 10)  
                .Take(10)               
                .ToListAsync();         

            var customerResults = customers
                .Select(c => new
                {
                    CustomerId = c.Id,  
                    CustomerName = c.FullName ?? (c.FirstName + " " + c.LastName)  
                })
                .ToList();

            var moreResults = customerResults.Count == 10;

            return Json(new
            {
                customers = customerResults,
                pagination = new
                {
                    more = moreResults
                }
            });
        }

        // GET: PurchaseOrders/Create
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PurchaseOrder purchaseOrderParams)
        {
            for (int i = 0; i < purchaseOrderParams.Items.Count; i++)
            {
                ModelState.Remove($"Items[{i}].Sku");
            }
            ModelState.Remove("Customer");
            if (ModelState.IsValid)
            {
                var purchaseOrder = new PurchaseOrder
                {
                    CustomerId = purchaseOrderParams.CustomerId,
                    DateOfDelivery = purchaseOrderParams.DateOfDelivery,
                    Status = purchaseOrderParams.Status,
                    AmountDue = purchaseOrderParams.AmountDue,
                    UserId = purchaseOrderParams.UserId,
                    CreatedBy = purchaseOrderParams.CreatedBy,
                    DateCreated = DateTime.UtcNow,
                    IsActive = true,
                    Timestamp = DateTime.UtcNow
                };

                _context.PurchaseOrders.Add(purchaseOrder);
                await _context.SaveChangesAsync();
                foreach (var itemDto in purchaseOrderParams.Items)
                {
                    var purchaseItem = new PurchaseItem
                    {
                        PurchaseOrderId = purchaseOrder.Id,
                        Skuid = itemDto.Skuid,
                        Quantity = itemDto.Quantity,
                        Price = itemDto.Price,
                        Timestamp = DateTime.UtcNow,
                        UserId = purchaseOrderParams.UserId
                    };

                    _context.PurchaseItems.Add(purchaseItem);
                }
                await _context.SaveChangesAsync();

                return Json(new { success = true, message = "Purchase Order created successfully." });
            }

            return BadRequest(ModelState);
        }

        // PUT: PurchaseOrders/Edit/5
        [HttpPut]
        public async Task<IActionResult> Edit(int id, [FromBody] PurchaseOrder purchaseOrderParams)
        {
            if (id != purchaseOrderParams.Id)
            {
                return NotFound();
            }
            ModelState.Remove("Id");
            ModelState.Remove("Customer");
            for (int i = 0; i < purchaseOrderParams.Items.Count; i++)
            {
                ModelState.Remove($"Items[{i}].Sku");
            }
            if (ModelState.IsValid)
            {
                try
                {
                    var purchaseOrder = await _context.PurchaseOrders.FindAsync(id);
                    if (purchaseOrder == null)
                    {
                        return NotFound("Purchase Order not found.");
                    }

                    purchaseOrder.CustomerId = purchaseOrderParams.CustomerId;
                    purchaseOrder.DateOfDelivery = purchaseOrderParams.DateOfDelivery;
                    purchaseOrder.Status = purchaseOrderParams.Status;
                    purchaseOrder.AmountDue = purchaseOrderParams.AmountDue;
                    purchaseOrder.UserId = purchaseOrderParams.UserId;
                    purchaseOrder.Timestamp = DateTime.UtcNow;

                    _context.PurchaseOrders.Update(purchaseOrder);
                    await _context.SaveChangesAsync();

                    _context.PurchaseItems.RemoveRange(_context.PurchaseItems.Where(x => x.PurchaseOrderId == id));

                    foreach (var itemDto in purchaseOrderParams.Items)
                    {
                        var purchaseItem = new PurchaseItem
                        {
                            PurchaseOrderId = purchaseOrder.Id,
                            Skuid = itemDto.Skuid,
                            Quantity = itemDto.Quantity,
                            Price = itemDto.Price,
                            Timestamp = DateTime.UtcNow,
                            UserId = purchaseOrderParams.UserId
                        };

                        _context.PurchaseItems.Add(purchaseItem);
                    }

                    await _context.SaveChangesAsync();

                    return Json(new { success = true, message = "Purchase Order updated successfully." });
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PurchaseOrderExists(purchaseOrderParams.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }

            return BadRequest(ModelState);
        }
        [HttpGet]
        public async Task<IActionResult> GetItemsByPurchaseOrderId(int id)
        {
            var items = await _context.PurchaseItems
                .Where(pi => pi.PurchaseOrderId == id)
                .Include(pi => pi.Sku) 
                .Select(pi => new
                {
                    pi.Id,
                    pi.PurchaseOrderId,
                    pi.Skuid,
                    pi.Sku.ImagePath,
                    SkuDisplay = pi.Sku.Code + " - " + pi.Sku.Name,
                    pi.Quantity,
                    pi.Price
                })
                .ToListAsync();

            return Json(items);
        }
        private bool PurchaseOrderExists(int id)
        {
            return _context.PurchaseOrders.Any(e => e.Id == id);
        }

    }
}
