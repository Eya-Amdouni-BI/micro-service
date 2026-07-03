-- Seed Categories
INSERT INTO category (id, name, description) VALUES (null, 'Organic Fruits', 'Fresh organic fruits from local farms');
INSERT INTO category (id, name, description) VALUES (null, 'Dairy & Eggs', 'Premium dairy products and free-range eggs');
INSERT INTO category (id, name, description) VALUES (null, 'Bakery', 'Freshly baked bread and pastries');

-- Seed Products
INSERT INTO product (name, description, price, stock, category_id) VALUES 
('Organic Avocado', 'Rich and creamy Hass avocados, perfect for toast.', 2.99, 100, 1),
('Fresh Blueberries', 'Sweet and antioxidant-rich blueberries.', 4.50, 60, 1),
('Greek Yogurt', 'Traditional thick and creamy Greek yogurt.', 5.20, 40, 2),
('Almond Milk', 'Unsweetened organic almond milk.', 3.75, 80, 2),
('Sourdough Bread', 'Artisan sourdough bread baked daily.', 6.00, 25, 3);
