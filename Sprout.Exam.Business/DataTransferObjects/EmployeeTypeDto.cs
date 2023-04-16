using System;
using System.Collections.Generic;
using System.Text;

namespace Sprout.Exam.Business.DataTransferObjects
{
    public class EmployeeTypeDto
    {
        public int Id { get; set; }
        public string TypeName { get; set; }
        public bool isMonthly { get; set; }
        public int DaysOfWork { get; set; }
        

    }
}
