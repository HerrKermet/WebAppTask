using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAppTask.Models;

namespace WebAppTask.Controllers
{
    [Route("api/Products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductContext _context;

        public ProductsController(ProductContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            //returns every product from the list
            if (_context.Products == null)
            {
                return NotFound();
            }
            return await _context.Products.ToListAsync();
        }

        private bool ProductExists(int id)
        {
            //helper function to check if the given product is in the database
            return (_context.Products?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        // GET: api/Products/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            //returns the  product specified by the given id if found
            if (_context.Products == null)
            {
                return NotFound();
            }
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // PUT: api/Products/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            //updates the product

            //make sure that the Id cannot be changed
            if (id != product.Id)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Products
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            //add product to list

            //if the product id already exists within the db then return "conflict" as statuscode
            if (ProductExists(product.Id))
            {
                return StatusCode(409);
            }

            _context.Products.Add(product);

            //wait till the changes are done
            await _context.SaveChangesAsync();

            Console.WriteLine("Post received: " + product.Id + "  " + product.Description);
            //return response 
            return Ok(product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            //deletes the product specified by the given id if found
            if (_context.Products == null)
            {
                return NotFound();
            }
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            Console.WriteLine("Delete request: " + $"{product.Id} {product.Description}");
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();


            return NoContent();
        }

        [HttpPost("InitializeData")]
        public async Task<IActionResult> InitializeData()
        {
            Product product1 = new Product
            {
                Id = 1,
                Name = "Kugelschreiber",
                Price = 10,
                Description = "Schreibt wunderbar - Farbe: Blau"
            };
            _context.Products.Add(product1);

            Product product2 = new Product
            {
                Id = 2,
                Name = "Notizbuch",
                Price = 4.50,
                Description = "Kariertes Notizbuch mit Hardcover"
            };
            _context.Products.Add(product2);

            Product product3 = new Product
            {
                Id = 3,
                Name = "Laptop",
                Price = 799,
                Description = "15-Zoll-Notebook mit leistungsstarker CPU"
            };
            _context.Products.Add(product3);

            Product product4 = new Product
            {
                Id = 4,
                Name = "Smartphone",
                Price = 499,
                Description = "Aktuelles Smartphone-Modell"
            };
            _context.Products.Add(product4);

            Product product5 = new Product
            {
                Id = 5,
                Name = "T-Shirt",
                Price = 9.99,
                Description = "Baumwoll-T-Shirt in verschiedenen Farben"
            };
            _context.Products.Add(product5);

            Product product6 = new Product
            {
                Id = 6,
                Name = "Kaffeemaschine",
                Price = 50,
                Description = "Filterkaffeemaschine für den Morgenkaffee"
            };
            _context.Products.Add(product6);

            Product product7 = new Product
            {
                Id = 7,
                Name = "Buch",
                Price = 20,
                Description = "Bestseller-Roman für Lesefreunde"
            };
            _context.Products.Add(product7);

            Product product8 = new Product
            {
                Id = 8,
                Name = "Sneakers",
                Price = 70,
                Description = "Bequeme Sneakers für den täglichen Gebrauch"
            };
            _context.Products.Add(product8);

            // Speichern der Änderungen in der Datenbank
            await _context.SaveChangesAsync();

            return Ok();
        }

    }
}
