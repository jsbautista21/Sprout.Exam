import React, { Component } from 'react';
import authService from '../../components/api-authorization/AuthorizeService';

export class EmployeeCalculate extends Component {
  static displayName = EmployeeCalculate.name;

  constructor(props) {
    super(props);
    this.state = { id: 0,fullName: '',birthdate: '',tin: '',typeName: '', salary: 0, isMonthly:false, daysOfWork:0, absentDays: 0,workedDays: 0,netIncome: 0, loading: true,loadingCalculate:false };
  }

  componentDidMount() {
    this.getEmployee(this.props.match.params.id);
  }
  handleChange(event) {
    this.setState({ [event.target.name] : event.target.value});
  }

  handleSubmit(e){
      e.preventDefault();
      this.calculateSalary();
  }

  render() {

    let contents = this.state.loading
    ? <p><em>Loading...</em></p>
    : <div>
    <form>
        <div className='form-row'>
            <div className='form-group col-md-12'>
              <label>Full Name: <b>{this.state.fullName}</b></label>
            </div>

        </div>

        <div className='form-row'>
            <div className='form-group col-md-12'>
              <label >Birthdate: <b>{this.state.birthdate}</b></label>
            </div>
        </div>

        <div className="form-row">
            <div className='form-group col-md-12'>
              <label>TIN: <b>{this.state.tin}</b></label>
            </div>
        </div>

        <div className="form-row">
            <div className='form-group col-md-12'>
              <label>Employee Type: <b>{this.state.typeName}</b></label>
            </div>
        </div>

        { this.state.isMonthly === true?
         <div className="form-row">
             <div className='form-group col-md-12'><label>Salary: {this.state.salary} </label></div>
             <div className='form-group col-md-12'><label>Tax: 12% </label></div>
        </div> :
            <div className="form-row">
                <div className='form-group col-md-12'><label>Rate Per Day: {this.state.salary} </label></div>
            </div>
        }

        <div className="form-row">

        { this.state.isMonthly === true? 
            <div className='form-group col-md-6'>
              <label htmlFor='inputAbsentDays4'>Absent Days: </label>
              <input type='number' step="0.01" className='form-control' id='inputAbsentDays4' onChange={this.handleChange.bind(this)} value={this.state.absentDays} name="absentDays" placeholder='Absent Days' />
            </div> :
            <div className='form-group col-md-6'>
              <label htmlFor='inputWorkDays4'>Worked Days: </label>
              <input type='number' step="0.01" className='form-control' id='inputWorkDays4' onChange={this.handleChange.bind(this)} value={this.state.workedDays} name="workedDays" placeholder='Worked Days' />
            </div>
        }
        </div>

        <div className="form-row">
            <div className='form-group col-md-12'>
              <label>Net Income: <b>{this.state.netIncome.toLocaleString("en-US")}</b></label>
            </div>
        </div>

        <button type="submit" onClick={this.handleSubmit.bind(this)} disabled={this.state.loadingCalculate} className="btn btn-primary mr-2">{this.state.loadingCalculate?"Loading...": "Calculate"}</button>
        <button type="button" onClick={() => this.props.history.push("/employees/index")} className="btn btn-primary">Back</button>
    </form>
</div>;


    return (
        <div>
        <h1 id="tabelLabel" >Employee Calculate Salary</h1>
        <br/>
        {contents}
      </div>
    );
  }

  async calculateSalary() {
    this.setState({ loadingCalculate: true });
    const token = await authService.getAccessToken();
    const requestOptions = {
        method: 'POST',
        headers: !token ? {} : { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json' },
        body: JSON.stringify(this.state)
    };
    const response = await fetch('api/employees/' + this.state.id + '/calculate',requestOptions);
    const data = await response.json();
    this.setState({ loadingCalculate: false,netIncome: data });
  }

  async getEmployee(Id) {
    this.setState({ loading: true,loadingCalculate: false });
    const token = await authService.getAccessToken();
    const response = await fetch('api/employees/' + Id, {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
    });

    if(response.status === 200){
        const data = await response.json();
        this.setState({ id: data[0].Id, fullName: data[0].FullName, birthdate: data[0].Birthdate, tin: data[0].TIN, typeName: data[0].TypeName, salary: data[0].Salary, isMonthly: data[0].isMonthly, daysOfWork: data[0].DaysOfWork, absentDays: data[0].AbsentDays, workedDays: data[0].WorkedDays, netIncome: data[0].NetIncome, loading: false,loadingCalculate: false });
    }
    else{
        alert("There was an error occured.");
        this.setState({ loading: false,loadingCalculate: false });
    }
  }
}
