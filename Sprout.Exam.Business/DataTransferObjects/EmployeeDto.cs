using System;
using System.Collections.Generic;
using System.Text;

namespace Sprout.Exam.Business.DataTransferObjects
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Birthdate { get; set; }
        public string Tin { get; set; }
        public int TypeId { get; set; }
        public string TypeName { get; set; }
        public float Salary { get; set; }
        public bool isMonthly { get; set; }
        public int DaysOfWork { get; set; }
        public float? AbsentDays { get; set; }
        public float? WorkedDays { get; set; }
        public float? NetIncome { get; set; }


    }
}
