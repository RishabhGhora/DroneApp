/* Database Initialization for Phase 3
CS 4400 - Spring 2021 */

drop database if exists grocery_drone_delivery;
create database if not exists grocery_drone_delivery;
use grocery_drone_delivery;

Create table CHAIN( 
	ChainName VARCHAR(40) NOT NULL, 
	PRIMARY KEY (ChainName) 
); 

Create table STORE( 
	StoreName VARCHAR(40) NOT NULL, 
	ChainName VARCHAR(40) NOT NULL, 
	Street VARCHAR(40) NOT NULL, 
	City VARCHAR(40) NOT NULL, 
	State VARCHAR(2) NOT NULL, 
	Zipcode char(5) NOT NULL, 
	FOREIGN KEY (ChainName) REFERENCES CHAIN(ChainName), 
	PRIMARY KEY(StoreName, ChainName),
	UNIQUE KEY (ChainName, Zipcode)
); 

Create table ITEM( 
	ItemName VARCHAR(40) NOT NULL,
	ItemType VARCHAR(40) NOT NULL, 
	Origin VARCHAR(40) NOT NULL, 
	Organic VARCHAR(3) NOT NULL, 
	PRIMARY KEY (ItemName) 
); 

Create table CHAIN_ITEM( 
	ChainItemName VARCHAR(40) NOT NULL, 
	ChainName VARCHAR(40) NOT NULL, 
	PLUNumber INT NOT NULL, 
	Orderlimit INT NOT NULL, 
	Quantity INT NOT NULL, 
	Price DECIMAL(4, 2) NOT NULL, 
	FOREIGN KEY (ChainItemName) REFERENCES ITEM(ItemName), 
	FOREIGN KEY (ChainName) REFERENCES CHAIN(ChainName), 
	PRIMARY KEY(ChainItemName, ChainName, PLUNumber),
	UNIQUE KEY (ChainName, PLUNumber) 
); 

Create table USERS( 
	Username VARCHAR(40) NOT NULL, 
	Pass VARCHAR(40) NOT NULL, 
	FirstName VARCHAR(40) NOT NULL, 
	LastName  VARCHAR(40) NOT NULL, 
	Street VARCHAR(40) NOT NULL, 
	City VARCHAR(40) NOT NULL, 
	State VARCHAR(2) NOT NULL, 
	Zipcode char(5) NOT NULL,
	PRIMARY KEY(Username)
); 

Create table ADMIN( 
	Username VARCHAR(40) NOT NULL, 
	FOREIGN KEY (Username) REFERENCES USERS(Username), 
	PRIMARY KEY (Username) 
); 

Create table CUSTOMER( 
	Username VARCHAR(40) NOT NULL, 
	CcNumber varchar(19) UNIQUE NOT NULL, 
	CVV INT NOT NULL, 
	EXP_DATE DATE,
	FOREIGN KEY (Username) REFERENCES USERS(Username),
	PRIMARY KEY (Username)
); 

Create table EMPLOYEE( 
	Username VARCHAR(40) NOT NULL,
	FOREIGN KEY (Username) REFERENCES USERS(Username), 
	PRIMARY KEY (Username) 
); 

Create table DRONE_TECH( 
	Username VARCHAR(40) NOT NULL, 
	StoreName VARCHAR(40) NOT NULL, 
	ChainName VARCHAR(40) NOT NULL, 
	FOREIGN KEY (Username) REFERENCES EMPLOYEE(Username), 
	FOREIGN KEY (StoreName, ChainName) REFERENCES STORE(StoreName, ChainName),  
	PRIMARY KEY (Username) 
); 

Create table MANAGER( 
	Username VARCHAR(40) NOT NULL, 
	ChainName VARCHAR(40) NOT NULL, 
	FOREIGN KEY (ChainName) REFERENCES CHAIN(ChainName), 
	FOREIGN KEY (Username) REFERENCES EMPLOYEE(Username),
	PRIMARY KEY (Username) 
); 

Create table DRONE( 
	ID INT NOT NULL AUTO_INCREMENT, 
	DroneStatus VARCHAR(20) NOT NULL, 
	Zip char(5) NOT NULL, 
	Radius INT NOT NULL, 
	DroneTech VARCHAR(40) NOT NULL, 
	FOREIGN KEY (DroneTech) REFERENCES DRONE_TECH(Username), 
	PRIMARY KEY (ID) 
); 

Create table ORDERS( 
	ID INT AUTO_INCREMENT,
	OrderStatus VARCHAR(20) NOT NULL, 
	OrderDate DATE NOT NULL, 
	CustomerUsername VARCHAR(40) NOT NULL, 
	DroneID int,  
	FOREIGN KEY (CustomerUsername) REFERENCES CUSTOMER(Username), 
	FOREIGN KEY (DroneID) REFERENCES DRONE(ID), 
	PRIMARY KEY (ID) 
); 

Create table CONTAINS( 
	OrderID INT NOT NULL, 
	ItemName VARCHAR(40) NOT NULL, 
	ChainName VARCHAR(40) NOT NULL, 
	PLUNumber INT NOT NULL ,
	Quantity INT NOT NULL, 
	FOREIGN KEY (OrderID) REFERENCES ORDERS(ID), 
	FOREIGN KEY (ItemName, ChainName, PLUNumber) REFERENCES CHAIN_ITEM(ChainItemName, ChainName, PLUNumber),
	PRIMARY KEY (OrderID, ItemName, ChainName, PLUNumber) 
); 

/*----------CHAIN------------------ */
INSERT INTO CHAIN
VALUES
('Kroger'),
('Publix'),
('Wal Mart'),
("Trader Joe's"),
('Whole Foods'),
('Sprouts'),
('Query Mart'),
('Moss Market');

/*----------STORE------------------ */
INSERT INTO STORE (ChainName, StoreName, Street, City, State, Zipcode) 
VALUES 
('Sprouts' ,'Abbots Bridge' ,'116 Bell Rd' ,'Johns Creek' ,'GA'	,30022),
('Whole Foods'	,'North Point'	,'532 8th St NW'	,'Johns Creek'	,'GA'	,30022),
('Kroger'	,'Norcross'	,'650 Singleton Road'	,'Duluth'	,'GA'	,30047),
('Wal Mart'	,'Pleasant Hill'	,'2365 Pleasant Hill Rd'	,'Duluth'	,'GA'	,30047),
('Moss Market'	,'KSU Center'	,'3305 Busbee Drive NW'	,'Kennesaw'	,'GA'	,30144),
("Trader Joe's"	,'Owl Circle'	,'48 Owl Circle SW'	,'Kennesaw'	,'GA'	,30144),
('Publix'	,'Park Place'	,'10 Park Place South SE'	,'Atlanta'	,'GA'	,30303),
('Publix'	,'The Plaza Midtown'	,'950 W Peachtree St NW'	,'Atlanta'	,'GA'	,30309),
('Query Mart'	,'GT Center'	,'172 6th St NW'	,'Atlanta'	,'GA'	,30313),
('Whole Foods'	,'North Avenue'	,'120 North Avenue NW'	,'Atlanta'	,'GA'	,30313),
('Sprouts'	,'Piedmont'	,'564 Piedmont ave NW'	,'Atlanta'	,'GA'	,30318),
('Kroger'	,'Midtown'	,'725 Ponce De Leon Ave'	,'Atlanta'	,'GA'	,30332),
('Moss Market'	,'Tech Square'	,'740 Ferst Drive '	,'Atlanta'	,'GA'	,30331),
('Moss Market'	,'Bobby Dodd'	,'150 Bobby Dodd Way NW'	,'Atlanta'	,'GA'	,30332),
('Query Mart'	,'Tech Square'	,'280 Ferst Drive NW'	,'Atlanta'	,'GA'	,30332),
('Moss Market'	,'College Park'	,'1895 Phoenix Blvd'	,'College Park'	,'GA'	,30339),
('Publix'	,'Atlanta Station'	,'595 Piedmot Ave NE'	,'Atlanta '	,'GA'	,30363);

/*----------ITEM------------------ */
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Navel Orange','Produce','California','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Gala Apple','Produce','New Zealand','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Fuji Apple','Produce','Georgia','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Strawberries','Produce','Wisconson','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Spinach','Produce','Florida','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Carrot','Produce','Alabama','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Potato','Produce','Alabama','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Onions','Produce','Mississippi','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Roma Tomato','Produce','Mexico','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Baby Food','Produce','Georgia','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('2% Milk','Diary','Georgia','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Whole Milk','Diary','Georgia','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Almond Milk','Diary','Georgia','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Ice Cream','Diary','Georgia','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Swiss Cheese','Diary','Italy','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Yogurt','Diary','Georgia','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('White Bread','Bakery','Georgia','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Brown bread','Bakery','Georgia','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Bagels','Bakery','Georgia','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Doughnuts','Bakery','Georgia','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Grassfed Beef','Meat','Georgia','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Turkey Wings','Meat','Georgia','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Chicken Breast','Meat','Georgia','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Chicken Thighs','Meat','Georgia','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Ground Breef','Meat','Texas','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Lamb Chops','Meat','New Zealand','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Bandaids','Personal Care','Arkansas','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Lavender Handsoap','Personal Care','France','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Lemon Handsoap','Personal Care','France','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('4-1 Shampoo','Personal Care','Michigan','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Toilet Paper','Personal Care','Kentucky','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Makeup','Personal Care','New York','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Toothbrush','Personal Care','Kansas','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Organic Toothpaste','Personal Care','Florida','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Toothpaste','Personal Care','Florida','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Baby Shampoo','Personal Care','Michigan','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Green Tea Shampoo','Personal Care','Michigan','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Bamboo Comb','Personal Care','Louisiana','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Plastic Comb','Personal Care','Louisiana','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Bamboo Brush','Personal Care','Louisiana','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Plastic Brush','Personal Care','Louisiana','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Spring Water','Beverages','California','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Disani','Beverages','California','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Pura Life','Beverages','California','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Coca-cola','Beverages','Georgia','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Pepsi','Beverages','Kansas','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Coffee','Beverages','Columbia','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Apple Juice','Beverages','Missouri','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Orange Juice','Beverages','Missouri','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Grape Juice','Beverages','Missouri','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Pomagranted Juice','Beverages','Florida','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Green Tea ','Beverages','India','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Black Tea','Beverages','India','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Rosemary Tea','Beverages','Greece','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Earl Grey Tea','Beverages','Italy','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Campbells Soup','Other','Georgia','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Organic Peanut Butter','Other ','Alabama','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Peanut Butter','Other','Alabama','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Sunflower Butter','Other','Alabama','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Sea salt','Other','Alaska','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Pepper','Other','Alaska','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Yellow Curry Powder','Other','India','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Cajun Seasoning','Other','Lousiana','Yes'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Stationary','Paper Goods','North Carolina','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Paper plates','Paper Goods','South Carolina','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Napkins','Paper Goods','South Carolina','No'); 
INSERT INTO `grocery_drone_delivery`.`item` (`ItemName`, `ItemType`, `Origin`, `Organic`) VALUES ('Paper Cups','Paper Goods','South Carolina','No'); 

/*----------CHAIN_ITEM------------------ */
INSERT INTO CHAIN_ITEM
VALUES
('White Bread'	,'Kroger'	,10001	,8	,220	,7.52),
('Brown Bread'	,'Kroger'	,10002	,10	,80	,6.99),
('Yogurt'	,'Kroger'	,10003	,6	,330	,3.27),
('Carrot'	,'Kroger'	,10004	,10	,370	,8.19),
('Coffee'	,'Kroger'	,10005	,8	,170	,4.30),
('Spinach'	,'Kroger'	,10006	,8	,130	,2.35),
('Pepsi'	,'Kroger'	,10007	,6	,340	,14.74),
('Lavender Handsoap'	,'Kroger'	,10008	,4	,140	,7.23),
('Gala Apple'	,'Moss Market'	,10001	,8	,450	,15.32),
('Fuji Apple'	,'Moss Market'	,10002	,2	,130	,1.99),
('Campbells Soup'	,'Moss Market'	,10003	,8	,390	,13.31),
('Carrot'	,'Publix'	,10001	,9	,110	,9.71),
('Peanut Butter'	,'Publix'	,10002	,6	,190	,10.35),
('Paper Cups'	,'Publix'	,10003	,10	,430	,20.18),
('Grape Juice'	,'Publix'	,10004	,7	,150	,11.89),
('Roma Tomato'	,'Publix'	,10005	,6	,140	,15.91),
('4-1 Shampoo'	,'Publix'	,10006	,6	,60	,5.85),
('Pepsi'	,'Publix'	,10007	,6	,440	,11.19),
('Chicken Thighs'	,'Publix'	,10008	,10	,280	,2.81),
('Bagels'	,'Publix'	,10009	,5	,130	,5.67),
('Lamb Chops'	,'Query Mart'	,10001	,2	,410	,7.72),
('Ice Cream'	,'Query Mart'	,10002	,2	,310	,13.58),
('2% Milk'	,'Sprouts'	,10001	,10	,410	,6.38),
('Whole Milk'	,'Sprouts'	,10002	,8	,370	,15.26),
('Yellow Curry Powder'	,'Sprouts'	,10003	,7	,230	,16.72),
('Peanut Butter'	,'Sprouts'	,10004	,7	,410	,1.30),
('Baby Food'	,'Sprouts'	,10005	,5	,170	,10.56),
('Sunflower Butter'	,"Trader Joe's"	,10001	,4	,160	,8.23),
('Green Tea '	,"Trader Joe's"	,10002	,4	,340	,7.25),
('Black Tea'	,"Trader Joe's"	,10003	,8	,130	,3.31),
('Rosemary Tea'	,"Trader Joe's"	,10004	,10	,310	,10.55),
('Earl Grey Tea'	,"Trader Joe's"	,10005	,8	,130	,20.53),
('Spinach'	,'Wal Mart'	,10001	,9	,320	,11.44),
('Bandaids'	,'Wal Mart'	,10002	,4	,300	,14.71),
('Coca-cola'	,'Wal Mart'	,10003	,6	,160	,14.85),
('Pepsi'	,'Wal Mart'	,10004	,10	,110	,3.21),
('Paper Cups'	,'Wal Mart'	,10005	,1	,50	,7.73),
('Napkins'	,'Wal Mart'	,10006	,4	,410	,18.36),
('Paper Plates'	,'Wal Mart'	,10007	,10	,60	,20.29),
('Grassfed Beef'	,'Whole Foods'	,10001	,1	,170	,13.88),
('Lamb Chops'	,'Whole Foods'	,10002	,4	,280	,20.14);

/*----------USERS------------------ */
INSERT INTO USERS
VALUES
('mmoss7'	,MD5('password3')	,'Mark'	,'Moss'	,'15 Tech Lane'	,'Duluth'	,'GA'	,30047),
('lchen27'	,MD5('password3')	,'Liang'	,'Chen'	,'40 Walker Rd '	,'Kennesaw'	,'GA'	,30144),
('jhilborn97'	,MD5('password4')	,'Jack'	,'Hilborn'	,'177 W Beaverdam Rd'	,'Atlanta'	,'GA'	,30303),
('jhilborn98'	,MD5('password5')	,'Jake'	,'Hilborn'	,'4605 Nasa Pkwy'	,'Atlanta'	,'GA'	,30309),
('ygao10'	,MD5('password6')	,'Yuan'	,'Gao'	,'27 Paisley Dr SW'	,'Atlanta'	,'GA'	,30313),
('kfrog03'	,MD5('password7')	,'Kermit'	,'Frog'	,'707 E Norfolk Ave'	,'Atlanta'	,'GA'	,30318),
('cforte58'	,MD5('password8')	,'Connor'	,'Forte'	,'13817 Shirley Ct NE'	,'Atlanta'	,'GA'	,30332),
('fdavenport49'	,MD5('password9')	,'Felicia'	,'Devenport'	,'6150 Old Millersport Rd NE'	,'College Park'	,'GA'	,30339),
('hliu88'	,MD5('password10')	,'Hang'	,'Liu'	,'1855 Fruit St'	,'Atlanta'	,'GA'	,30363),
('akarev16'	,MD5('password11')	,'Alex'	,'Karev'	,'100 NW 73rd Pl '	,'Johns Creek'	,'GA'	,30022),
('jdoe381'	,MD5('password12')	,'Jane '	,'Doe'	,'12602 Gradwell St'	,'Duluth'	,'GA'	,30047),
('sstrange11'	,MD5('password13')	,'Stephen'	,'Strange'	,'112 Huron Dr'	,'Kennesaw'	,'GA'	,30144),
('dmcstuffins7'	,MD5('password14')	,'Doc'	,'Mcstuffins'	,'27 Elio Cir'	,'Atlanta'	,'GA'	,30303),
('mgrey91'	,MD5('password15')	,'Meredith'	,'Grey'	,'500 N Stanwick Rd'	,'Atlanta'	,'GA'	,30309),
('pwallace51'	,MD5('password16')	,'Penny'	,'Wallace'	,'3127 Westwood Dr NW'	,'Atlanta'	,'GA'	,30313),
('jrosario34'	,MD5('password17')	,'Jon'	,'Rosario'	,'1111 Catherine St'	,'Atlanta'	,'GA'	,30318),
('nshea230'	,MD5('password18')	,'Nicholas'	,'Shea'	,'299 Shady Ln'	,'Atlanta'	,'GA'	,30332),
('mgeller3'	,MD5('password19')	,'Monica '	,'Geller'	,'120 Stanley St'	,'College Park'	,'GA'	,30339),
('rgeller9'	,MD5('password20')	,'Ross'	,'Geller '	,'4206 106th Pl NE'	,'Atlanta'	,'GA'	,30363),
('jtribbiani27'	,MD5('password21')	,'Joey '	,'Tribbiani'	,'143 Pebble Ln'	,'Johns Creek'	,'GA'	,30022),
('pbuffay56'	,MD5('password22')	,'Phoebe '	,'Buffay'	,'230 County Rd'	,'Duluth'	,'GA'	,30047),
('rgreen97'	,MD5('password23')	,'Rachel'	,'Green'	,'40 Frenchburg Ct'	,'Kennesaw'	,'GA'	,30144),
('cbing101'	,MD5('password24')	,'Chandler '	,'Bing'	,'204 S Mapletree Ln'	,'Atlanta'	,'GA'	,30303),
('pbeesly61'	,MD5('password25')	,'Pamela'	,'Beesly'	,'932 Outlaw Bridge Rd'	,'Atlanta'	,'GA'	,30309),
('jhalpert75'	,MD5('password26')	,'Jim '	,'Halpert'	,'185 Dry Creek Rd'	,'Atlanta'	,'GA'	,30313),
('dschrute18'	,MD5('password27')	,'Dwight '	,'Schrute'	,'3009 Miller Ridge Ln'	,'Atlanta'	,'GA'	,30318),
('amartin365'	,MD5('password28')	,'Angela '	,'Martin'	,'905 E Pinecrest Cir'	,'Atlanta'	,'GA'	,30332),
('omartinez13'	,MD5('password29')	,'Oscar'	,'Martinez'	,'26958 Springcreek Rd'	,'College Park'	,'GA'	,30339),
('mscott845'	,MD5('password30')	,'Michael '	,'Scott'	,'105 Calusa Lake Dr'	,'Denver'	,'CO'	,80014),
('abernard224'	,MD5('password31')	,'Andy '	,'Bernard'	,'21788 Monroe Rd #284'	,'Johns Creek'	,'GA'	,30022),
('kkapoor155'	,MD5('password32')	,'Kelly '	,'Kapoor'	,'100 Forest Point Dr'	,'Duluth'	,'GA'	,30047),
('dphilbin81'	,MD5('password33')	,'Darryl '	,'Philbin'	,'800 Washington St'	,'Kennesaw'	,'GA'	,30144),
('sthefirst1'	,MD5('password34')	,'Sofia'	,'Thefirst'	,'4337 Village Creek Dr'	,'Atlanta'	,'GA'	,30303),
('gburdell1'	,MD5('password35')	,'George'	,'Burdell'	,'201 N Blossom St'	,'Atlanta'	,'GA'	,30309),
('dsmith102'	,MD5('password36')	,'Dani'	,'Smith'	,'1648 Polk Rd'	,'Atlanta'	,'GA'	,30313),
('dbrown85'	,MD5('password37')	,'David'	,'Brown'	,'12831 Yorba Ave'	,'Atlanta'	,'GA'	,30318),
('dkim99'	,MD5('password38')	,'Dave'	,'Kim'	,'1710 Buckner Rd'	,'Atlanta'	,'GA'	,30332),
('tlee984'	,MD5('password39')	,'Tom'	,'Lee'	,'205 Mountain Ave'	,'College Park'	,'GA'	,30339),
('jpark29'	,MD5('password40')	,'Jerry'	,'Park'	,'520 Burberry Way'	,'Atlanta'	,'GA'	,30363),
('vneal101'	,MD5('password41')	,'Vinay'	,'Neal'	,'190 Drumar Ct'	,'Johns Creek'	,'GA'	,30022),
('hpeterson55'	,MD5('password42')	,'Haydn'	,'Peterson'	,'878 Grand Ivey Pl'	,'Duluth'	,'GA'	,30047),
('lpiper20'	,MD5('password43')	,'Leroy'	,'Piper'	,'262 Stonecliffe Aisle'	,'Kennesaw'	,'GA'	,30144),
('mbob2'	,MD5('password44')	,'Chuck'	,'Bass'	,'505 Bridge St'	,'New York'	,'NY'	,10033),
('mrees785'	,MD5('password45')	,'Marie'	,'Rees'	,'1081 Florida Ln'	,'Atlanta'	,'GA'	,30309),
('wbryant23'	,MD5('password46')	,'William'	,'Bryant'	,'109 Maple St'	,'Atlanta'	,'GA'	,30313),
('aallman302'	,MD5('password47')	,'Aiysha'	,'Allman'	,'420 Austerlitz Rd'	,'Atlanta'	,'GA'	,30318),
('kweston85'	,MD5('password48')	,'Kyle'	,'Weston'	,'100 Palace Dr'	,'Birmingham'	,'AL'	,35011),
('lknope98'	,MD5('password49')	,'Leslie '	,'Knope'	,'10 Dogwood Ln'	,'College Park'	,'GA'	,30339),
('bwaldorf18'	,MD5('password50')	,'Blair '	,'Waldorf'	,'1110 Greenway Dr'	,'Atlanta'	,'GA'	,30363);

/*----------ADMIN------------------ */
INSERT INTO ADMIN
VALUES
('mmoss7');

/*----------CUSTOMER------------------ */
INSERT INTO CUSTOMER
VALUES
('mscott845'	,'6518 5559 7446 1663'	,551	,'2024-2-01'),
('abernard224'	,'2328 5670 4310 1965'	,644	,'2024-5-01'),
('kkapoor155'	,'8387 9523 9827 9291'	,201	,'2031-2-01'),
('dphilbin81'	,'6558 8596 9852 5299'	,102	,'2031-12-01'),
('sthefirst1'	,'3414 7559 3721 2479'	,489	,'2021-11-01'),
('gburdell1'	,'5317 1210 9087 2666'	,852	,'2022-1-01'),
('dsmith102'	,'9383 3212 4198 1836'	,455	,'2029-8-01'),
('dbrown85'	,'3110 2669 7949 5605'	,744	,'2022-10-01'),
('dkim99'	,'2272 3555 4078 4744'	,606	,'2029-8-01'),
('tlee984'	,'9276 7639 7883 4273'	,862	,'2031-8-01'),
('jpark29'	,'4652 3726 8864 3798'	,258	,'2030-12-01'),
('vneal101'	,'5478 8420 4436 7471'	,857	,'2029-9-01'),
('hpeterson55'	,'3616 8977 1296 3372'	,295	,'2023-4-01'),
('lpiper20'	,'9954 5698 6355 6952'	,794	,'2022-4-01'),
('mbob2'	,'7580 3274 3724 5356'	,269	,'2027-5-01'),
('mrees785'	,'7907 3513 7161 4248'	,858	,'2027-8-01'),
('wbryant23'	,'1804 2062 7825 9689'	,434	,'2030-4-01'),
('aallman302'	,'2254 7887 8863 3807'	,862	,'2021-4-01'),
('kweston85'	,'8445 8585 2138 1374'	,632	,'2030-11-01'),
('lknope98'	,'1440 2292 5962 4450'	,140	,'2031-4-01'),
('bwaldorf18'	,'5839 2673 8600 1880'	,108	,'2029-12-01');

/*----------EMPLOYEE------------------ */
INSERT INTO EMPLOYEE
VALUES
('lchen27'),
('jhilborn97'),
('jhilborn98'),
('ygao10'),
('kfrog03'),
('cforte58'),
('fdavenport49'),
('hliu88'),
('akarev16'),
('jdoe381'),
('sstrange11'),
('dmcstuffins7'),
('mgrey91'),
('pwallace51'),
('jrosario34'),
('nshea230'),
('mgeller3'),
('rgeller9'),
('jtribbiani27'),
('pbuffay56'),
('rgreen97'),
('cbing101'),
('pbeesly61'),
('jhalpert75'),
('dschrute18'),
('amartin365'),
('omartinez13');

/*-----------DRONETECH-------------- */
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('lchen27','KSU Center','Moss Market'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('jhilborn97','Park Place','Publix'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('jhilborn98','The Plaza Midtown','Publix'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('ygao10','North Avenue','Whole Foods'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('kfrog03','Piedmont','Sprouts'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('cforte58','Tech Square','Query Mart'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('fdavenport49','College Park','Moss Market'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('hliu88','Atlanta Station','Publix'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('akarev16','North Point','Whole Foods'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('jdoe381','Norcross','Kroger'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('sstrange11','Owl Circle',"Trader Joe's"); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('dmcstuffins7','Park Place','Publix'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('mgrey91','The Plaza Midtown','Publix'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('pwallace51','GT Center','Query Mart'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('jrosario34','Piedmont','Sprouts'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('nshea230','Midtown','Kroger'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('mgeller3','College Park','Moss Market'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('rgeller9','Atlanta Station','Publix'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('jtribbiani27','Abbots Bridge','Sprouts'); 
INSERT INTO `grocery_drone_delivery`.`drone_tech` (`Username`,`StoreName`,`ChainName`) VALUES('pbuffay56','Pleasant Hill','Wal Mart'); 

/*----------MANAGER------------------ */
INSERT INTO MANAGER
VALUES
('rgreen97',	'Kroger'),
('cbing101',	'Publix'),
('pbeesly61',	'Wal Mart'),
('jhalpert75',	"Trader Joe's"),
('dschrute18',	'Whole Foods'),
('amartin365',	'Sprouts'),
('omartinez13',	'Query Mart');

/*------------DRONE----------------- */
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (101,'Available',30022,5,'jtribbiani27'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (102,'Available',30047,7,'jdoe381'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (103,'Available',30144,3,'lchen27'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (104,'Busy',30303,8,'dmcstuffins7'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (105,'Available',30309,4,'jhilborn98'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (106,'Available',30313,6,'ygao10'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (107,'Available',30318,8,'jrosario34'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (108,'Available',30332,7,'nshea230'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (109,'Available',30339,5,'fdavenport49'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (110,'Available',30363,5,'hliu88'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (111,'Busy',30022,5,'akarev16'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (112,'Busy',30047,6,'pbuffay56'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (113,'Available',30144,6,'sstrange11'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (114,'Available',30303,8,'jhilborn97'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (115,'Available',30309,7,'mgrey91'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (116,'Available',30313,3,'pwallace51'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (117,'Available',30318,9,'kfrog03'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (118,'Available',30332,5,'cforte58'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (119,'Available',30339,7,'mgeller3'); 
INSERT INTO `grocery_drone_delivery`.`drone`(`ID`,`DroneStatus`,`Zip`,`Radius`,`DroneTech`) VALUES (120,'Available',30363,7,'rgeller9'); 

/*---------ORDER-------------------- */
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10001','Delivered','2021-01-03','hpeterson55',102);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10002','Delivered','2021-01-13','abernard224',111);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10003','Delivered','2021-01-13','dbrown85',117);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10004','Delivered','2021-01-16','dkim99',108);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10005','Delivered','2021-01-21','dphilbin81',103);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10006','Delivered','2021-01-22','sthefirst1',104);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10007','Delivered','2021-01-22','sthefirst1',104);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10008','Delivered','2021-01-28','wbryant23',116);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10009','Delivered','2021-02-01','hpeterson55',112);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10010','Delivered','2021-02-04','kkapoor155',112);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10011','Delivered','2021-02-05','aallman302',117);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10012','In Transit','2021-02-14','vneal101',111);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10013','In Transit','2021-02-14','sthefirst1',104);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10014','Drone Assigned','2021-02-14','hpeterson55',112);
INSERT INTO `grocery_drone_delivery`.`orders`(`ID`,`OrderStatus`,`OrderDate`,`CustomerUsername`,`DroneID`)VALUES ('10015','Pending','2021-02-24','lpiper20',null);

/*----------CONTAINS----------------------*/
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10001','Yogurt','Kroger',10003,4); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10001','White Bread','Kroger',10001,1); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10001','Carrot','Kroger',10004,10); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10001','Coffee','Kroger',10005,1); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10001','Spinach','Kroger',10006,2); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10002','Lamb Chops','Whole Foods',10002,2); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10003','2% Milk','Sprouts',10001,2); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10003','Yellow Curry Powder','Sprouts',10003,3); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10003','Peanut Butter','Sprouts',10004,1); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10004','Brown Bread','Kroger',10002,2); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10005','Gala Apple','Moss Market',10001,6); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10005','Fuji Apple','Moss Market',10002,2); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10006','Peanut Butter','Publix',10002,1); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10006','Paper Cups','Publix',10003,6); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10006','Grape Juice','Publix',10004,2); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10006','Roma Tomato','Publix',10005,6); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10006','4-1 Shampoo','Publix',10006,1); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10006','Carrot','Publix',10001,5); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10007','4-1 Shampoo','Publix',10006,1); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10008','Ice Cream','Query Mart',10002,1); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10009','Bandaids','Wal Mart',10002,4); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10010','Pepsi','Wal Mart',10004,1); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10010','Coca-cola','Wal Mart',10003,1); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10011','Baby Food','Sprouts',10005,3); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10012','Grassfed Beef','Whole Foods',10001,1); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10013','Chicken Thighs','Publix',10008,2); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10014','Napkins','Wal Mart',10006,1); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10014','Paper Plates','Wal Mart',10007,8); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10015','Green Tea ',"Trader Joe's",10002,2); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10015','Black Tea',"Trader Joe's",10003,2); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10015','Rosemary Tea',"Trader Joe's",10004,2); 
INSERT INTO `grocery_drone_delivery`.`contains`(`OrderID`,`ItemName`,`ChainName`,`PLUNumber`,`Quantity`) VALUES ('10015','Earl Grey Tea',"Trader Joe's",10005,2); 
