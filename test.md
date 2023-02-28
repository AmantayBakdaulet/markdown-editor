# Lab #09

1. Create a stored procedure that adds the missing data to the «Bank scheme» database.

```sql
create procedure missing_data
as begin
	update EMPLOYEE
	set END_DATE = DATEADD(MONTH, 12, START_DATE);
end
exec missing_data;
select START_DATE, END_DATE from EMPLOYEE;
```

2. Create a stored procedure that changes the datetime data type to date for all the corresponding columns of the «Bank scheme».

```sql
select c.COLUMN_NAME, t.TABLE_NAME
	FROM INFORMATION_SCHEMA.COLUMNS as c
	join INFORMATION_SCHEMA.TABLES as t
	on t.TABLE_NAME = c.TABLE_NAME
	WHERE c.DATA_TYPE = 'datetime';

create procedure change_datatype
as
begin
	alter table ACCOUNT alter column CLOSE_DATE date;
	alter table ACCOUNT alter column LAST_ACTIVITY_DATE date;
	alter table ACCOUNT alter column OPEN_DATE date;
	alter table ACC_TRANSACTION alter column FUNDS_AVAIL_DATE date;
	alter table ACC_TRANSACTION alter column TXN_DATE date;
	alter table BUSINESS alter column INCORP_DATE date;
	alter table EMPLOYEE alter column END_DATE date;
	alter table EMPLOYEE alter column START_DATE date;
	alter table INDIVIDUAL alter column BIRTH_DATE date;
	alter table OFFICER alter column END_DATE date;
	alter table OFFICER alter column START_DATE date;
	alter table PRODUCT alter column DATE_OFFERED date;
	alter table PRODUCT alter column DATE_RETIRED date;
end;

exec change_datatype;
```

3. Create a stored procedure that counts the number of accounts for each bank  customer and returns either ‘None’, ‘1’, ‘2’ or ‘3+’. The result set should  include the customer identification number, the customer type and the number of accounts.

```sql
create procedure number_of_accs
as begin
	select c.CUST_ID, c.CUST_TYPE_CD, sub.cnt as Number_of_Accs
	from CUSTOMER c
	join (
	select CUST_ID, 
		case 
			when COUNT(ACCOUNT_ID) = 0 then 'None'
			when COUNT(ACCOUNT_ID) = 1 then '1'
			when COUNT(ACCOUNT_ID) = 2 then '2'
			when COUNT(ACCOUNT_ID) >= 3 then '3+' 
		end as cnt
		from ACCOUNT
		group by CUST_ID) sub
	on sub.CUST_ID = c.CUST_ID;
end;
exec number_of_accs;
```

4. Create a stored procedure that uses two CASE expressions to generate two  output columns, one to show whether the customer has any checking accounts and the other to show whether the customer has any savings accounts. If the customer has the account, print ‘Y’, otherwise print ‘N’. The result set should include the following information: the customer ID, their home address, the existence of checking accounts and the existence of savings accounts.

```sql
create procedure two_case
as begin
	select sub.CUST_ID, c.address,
		case
			when c.CUST_ID in (select CUST_ID from ACCOUNT) then 'Y' else 'N'
		end as 'check_acc',
		case 
			when c.CUST_ID in (
				select c.cust_id 
					from CUSTOMER c
					join ACCOUNT ac
					on c.CUST_ID = ac.CUST_ID
					join ACC_TRANSACTION atr
					on ac.ACCOUNT_ID = atr.ACCOUNT_ID) then 'Y' else 'N' 
		end as 'saving_acc'
		from CUSTOMER c
		join (select CUST_ID from CUSTOMER) sub
		on c.CUST_ID = sub.CUST_ID;
end;
exec two_case;
```

5. Create a stored procedure that declares a variable and set it to the count of all
PRODUCT_TYPE_CD in the Product_Type table. If the count is greater than 
or equal to 3, the stored procedure should display a message that says, “The 
number of PRODUCT_TYPE_CD is greater than or equal to 3”.
Otherwise, it should say, “The number of PRODUCT_TYPE_CD is less than 
3”.

```sql
create procedure show_message
as begin 
	declare @cnt int = 0;
	declare @message char(100) = ''; 
	select @cnt = count(PRODUCT_TYPE_CD) from PRODUCT_TYPE;
	if @cnt >= 3
		set @message = 'The number of PRODUCT_TYPE_CD is greater than or equal to 3';
	else
		set @message = 'The number of PRODUCT_TYPE_CD is less than 3';
	print(@message);
end;
exec show_message;
```

6. Create a stored procedure that uses two variables to store:
a) the count of all of the customers in the Customer table;
b) the average avail balance for each customer. 
If the customers count is greater than or equal to 13, the stored procedure  should display a result set that displays the values of both variables. Otherwise, the procedure should display a result set that displays a message that says, “The number of customers is less than 13”.

```sql
create procedure two_variable 
as begin
	declare @cnt int; 
	declare @average float;
	declare @table table(id int identity(1,1), average float)
	set @cnt = (select count(CUST_ID) from CUSTOMER);
	insert into @table 
		select avg(AVAIL_BALANCE) 
			from ACCOUNT
			group by CUST_ID;
	if @cnt >= 13
	begin 
		declare @i int;
		declare @length int;
		set @i = 0;
		while (@i <= (select top 1 id from @table order by id desc))
			begin
				select * from @table where id = @i
				set @i = @i + 1
			end
		print @cnt;
	end
	else
		print 'The number of customers is less than 13';
end;
exec two_variable;
```


```sql
create procedure two_variable2 
as begin
	declare @cnt int; 
	declare @average float;
	set @cnt = (select count(CUST_ID) from CUSTOMER);
	set @average = (select AVG(AVAIL_BALANCE) from ACCOUNT)
	if @cnt >= 13
	begin 
		print concat('Count is ', @cnt, '. Average is ', @average, '.');
	end
	else
		print 'The number of customers is less than 13';
end;
exec two_variable2;
```

7. Create a stored procedure that calculates the common factors between 15 and
30. This procedure should display a string that displays the common factors 
in this form:
Common factors of 15 and 30: 1 3 5 15

```sql
create function minimum(@n1 int, @n2 int)
returns int as
begin
	declare @min int;
	if @n1 < @n2
		set @min = @n1
	else
		set @min = @n2
return @min
end;

create procedure common_factors
as begin
	declare @n1 int = 15;
	declare @n2 int = 30;
	declare @string varchar(40) = '';
	declare @i int = 1; 

	while (@i < (select [dbo].[minimum](@n1, @n2)) + 1)
	begin
		if @n1 % @i = 0 and @n2 % @i = 0
			set @string = @string + ' ' + convert(varchar, @i)
			set @i = @i + 1
	end
	print 'Common factors of 15 and 30:' + @string
end;
exec common_factors;
```

8. Create a stored procedure that shows all numeric characters from the entire string. You can use the ADDRESS columns in the «Bank scheme» database or any row of your choice.

```sql
create procedure is_numeric
as begin
    select substring(address, 1, charindex(' ', address, 1)) as number from CUSTOMER;
end;
exec is_numeric;
```

9. Create a stored procedure for the «Bank scheme» database of your choice. 
Condition: the procedure must be encrypted.

```sql
create procedure average_avail_bal
WITH ENCRYPTION
as begin
	select CUST_ID, avg(AVAIL_BALANCE) as AvgForEach 
		from account
		group by CUST_ID;
end;
exec average_avail_bal;
```


10. Create two stored procedures for the «Bank scheme» database. Condition: 
one procedure must call another

```sql
create procedure one1
as begin
alter table account alter column close_date datetime;   
end;

create procedure two2
as begin
exec one1
end;
exec two2;
select column_name, data_type from INFORMATION_SCHEMA.COLUMNS where COLUMN_NAME = 'CLOSE_DATE';
```

11. This code is supposed to be pythonic

```python
def add(a: int, b: int) -> int:
    return a + b

x, y, res = 1, 4, 5
assert add(x, y) == res
```