using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Sprout.Exam.Business.DataTransferObjects;
using Sprout.Exam.Common.Enums;
using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Runtime.Intrinsics.Arm;

namespace Sprout.Exam.WebApp.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {

        private readonly IConfiguration _configuration;

        public EmployeesController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Refactor this method to go through proper layers and fetch from the DB.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                string query = @"SELECT     Employee.Id, Employee.FullName, convert(varchar(10),Employee.Birthdate,120) as Birthdate , Employee.TIN, EmployeeType.TypeName
                                FROM        Employee INNER JOIN
                                            EmployeeType ON Employee.EmployeeTypeId = EmployeeType.Id
                                WHERE       ISNULL(Employee.IsDeleted,0) = 0
                    ";
                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
                SqlDataReader myReader;
                using (SqlConnection myCon = new SqlConnection(sqlDataSource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                }

                var json = JsonConvert.SerializeObject(table);
                return Ok(json);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
         
        }



        /// <summary>
        /// Refactor this method to go through proper layers and fetch from the DB.
        /// </summary>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                string query = @"SELECT    Employee.Id, Employee.FullName, convert(varchar(10),Employee.Birthdate,120) as Birthdate , Employee.TIN, Employee.EmployeeTypeId, EmployeeType.TypeName, ISNULL(Employee.Salary,0) AS Salary, EmployeeType.isMonthly, ISNULL(EmployeeType.DaysOfWork,0) AS DaysOfWork, ISNULL(Employee.AbsentDays,0) AS AbsentDays, ISNULL(Employee.WorkedDays,0) AS WorkedDays, ISNULL(Employee.NetIncome,0) AS NetIncome
                                 FROM      Employee INNER JOIN
                                           EmployeeType ON Employee.EmployeeTypeId = EmployeeType.Id
                                 WHERE     Employee.Id = " + id + @" 
                    ";
                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
                SqlDataReader myReader;
                using (SqlConnection myCon = new SqlConnection(sqlDataSource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader);

                        myReader.Close();
                        myCon.Close();
                    }
                }

                var json = JsonConvert.SerializeObject(table);
                return Ok(json);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Refactor this method to go through proper layers and update changes to the DB.
        /// </summary>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(EditEmployeeDto input)
        {
            try
            {

                string query = @"
                    UPDATE  dbo.Employee 
                    SET     FullName = '" + input.FullName + @"'
                           ,Birthdate = '" + input.Birthdate + @"'
                           ,TIN = '" + input.Tin + @"'
                           ,EmployeeTypeId = '" + input.TypeId + @"'
                            ,Salary = '" + input.Salary + @"'
                    WHERE   Id = " + input.Id + @" 
                    ";
                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
                SqlDataReader myReader;
                using (SqlConnection myCon = new SqlConnection(sqlDataSource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader); ;

                        myReader.Close();
                        myCon.Close();
                    }
                }

                return new JsonResult("Updated Successfully");
            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        /// <summary>
        /// Refactor this method to go through proper layers and insert employees to the DB.
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> Post(CreateEmployeeDto input)
        {
            try
            {
                string query = @"
                    INSERT INTO dbo.Employee
                            (FullName
                            ,Birthdate
                            ,TIN
                            ,EmployeeTypeId
                            ,Salary)
                    VALUES 
                            (
                            '" + input.FullName + @"'
                            ,'" + input.Birthdate + @"'
                            ,'" + input.Tin + @"'
                            ,'" + input.TypeId + @"'
                            ,'" + input.Salary + @"'
                            )
                    SELECT SCOPE_IDENTITY()
                    ";
                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
                SqlDataReader myReader;
                using (SqlConnection myCon = new SqlConnection(sqlDataSource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader); ;

                        myReader.Close();
                        myCon.Close();
                    }
                }

                int id = Convert.ToInt32(table.Rows[0]["Column1"].ToString());
                return Created($"/api/employees/{id}", id);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }


        /// <summary>
        /// Refactor this method to go through proper layers and perform soft deletion of an employee to the DB.
        /// </summary>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                string query = @"
                    UPDATE  dbo.Employee 
                    SET     IsDeleted = '1'
                    WHERE   Id = " + id + @" 
                    ";
                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
                SqlDataReader myReader;
                using (SqlConnection myCon = new SqlConnection(sqlDataSource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader); ;

                        myReader.Close();
                        myCon.Close();
                    }
                }

                return Ok(id);
            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }



        /// <summary>
        /// Refactor this method to go through proper layers and use Factory pattern
        /// </summary>
        /// <param name="id"></param>
        /// <param name="absentDays"></param>
        /// <param name="workedDays"></param>
        /// <returns></returns>
        [HttpPost("{id}/calculate")]
        public async Task<IActionResult> Calculate(EmployeeDto input)
        {

            try
            {
                decimal netSalary = 0;
                if (input.isMonthly == true)
                {
                    netSalary = Convert.ToDecimal(string.Format("{0:F2}", input.Salary - ((input.Salary / input.DaysOfWork) * input.AbsentDays) - (input.Salary * 0.12)));
                }
                else
                {
                    netSalary = Convert.ToDecimal(string.Format("{0:F2}", input.Salary * input.WorkedDays));
                }

                string query = @"
                    UPDATE  dbo.Employee 
                    SET     NetIncome = '" + netSalary + @"'
                            ,AbsentDays = '" + input.AbsentDays + @"'
                            ,WorkedDays = '" + input.WorkedDays + @"'
                    WHERE   Id = " + input.Id + @" 
                    ";
                DataTable table = new DataTable();
                string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");
                SqlDataReader myReader;
                using (SqlConnection myCon = new SqlConnection(sqlDataSource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myReader = myCommand.ExecuteReader();
                        table.Load(myReader); ;

                        myReader.Close();
                        myCon.Close();
                    }
                }

                return Ok(netSalary);
            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

    }
}
