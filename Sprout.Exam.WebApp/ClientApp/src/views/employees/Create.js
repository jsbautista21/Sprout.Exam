import React, { Component } from 'react';
import { FormErrors } from './FormErrors';
import authService from '../../components/api-authorization/AuthorizeService';


export class EmployeeCreate extends Component {
    static displayName = EmployeeCreate.name;

  constructor(props) {
    super(props);
      this.state = {
          employeeType: [], fullName: '', birthdate: '', tin: '', typeId: 1, salary: 0, loading: false, loadingSave: false,
          formErrors: { fullName: '', birthdate: '', tin: '', salary: '' },
          fullNameValid: false,
          birthdateValid: false,
          tinValid: false,
          typeValid: true,
          salaryValid: false,
          formValid: false      };
    }



    componentDidMount() {
        this.populateEmployeeType();
    }

    async populateEmployeeType() {
        const token = await authService.getAccessToken();
        const response = await fetch('api/employeetype', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ employeeType: data, loading: false });
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value },
            () => { this.validateField([name], value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let fullNameValid = this.state.fullNameValid;
        let birthdateValid = this.state.birthdateValid;
        let tinValid = this.state.tinValid;
        let salaryValid = this.state.salaryValid;

        switch (fieldName[0]) {
            case 'fullName':
                fullNameValid = value.length > 0;
                fieldValidationErrors.fullName = fullNameValid ? '' : ' *Fullname is required';
                break;
            case 'birthdate':
                birthdateValid = value.length > 0;
                fieldValidationErrors.birthdate = birthdateValid ? '' : ' *Birthdate is invalid';
                break;
            case 'tin':
                tinValid = value.length > 0;
                fieldValidationErrors.tin = tinValid ? '' : ' *TIN is required';
                break;
            case 'salary':
                salaryValid = value > 0;
                fieldValidationErrors.salary = salaryValid ? '' : ' *Salary is required and cannot be a negative or zero value';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            fullNameValid: fullNameValid,
            birthdateValid: birthdateValid,
            tinValid: tinValid,
            salaryValid: salaryValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({ formValid: this.state.fullNameValid && this.state.birthdateValid && this.state.tinValid && this.state.salaryValid && this.state.typeValid });
    }

    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

  handleSubmit(e){
      e.preventDefault();
      this.validateForm();
      if (this.state.formValid === true) {
          if (window.confirm("Are you sure you want to save?")) {
              this.saveEmployee();
          }
      }
      else {
          alert("All fields are required.");
      }
  }

  render() {

    let contents = this.state.loading
        ? <p><em>Loading...</em></p>


        : <div>

        <form>
            <div className="panel panel-default">
                <FormErrors formErrors={this.state.formErrors} />
            </div>    
                
            <div className="form-row">
                <div className={`form-group col-md-6 ${this.errorClass(this.state.formErrors.fullName)}`} >
                    <label htmlFor='inputFullName4'>Full Name: *</label>
                        <input type='text' required className='form-control' id='inputFullName4' onChange={this.handleChange.bind(this)}  name="fullName" value={this.state.fullName} placeholder='Full Name' />                       
                </div>
               <div className={`form-group col-md-6 ${this.errorClass(this.state.formErrors.birthdate)}`} >
                    <label htmlFor='inputBirthdate4'>Birthdate: *</label>
                    <input type='date' className='form-control' id='inputBirthdate4' onChange={this.handleChange.bind(this)} name="birthdate" value={this.state.birthdate} placeholder='Birthdate' />
                </div>
            </div>

            <div className="form-row">
                <div className={`form-group col-md-6 ${this.errorClass(this.state.formErrors.tin)}`} >
                  <label htmlFor='inputTin4'>TIN: *</label>
                  <input type='text' className='form-control' id='inputTin4' onChange={this.handleChange.bind(this)} value={this.state.tin} name="tin" placeholder='TIN' />
                </div>

                <div className='form-group col-md-6' >
                  <label htmlFor='inputEmployeeType4'>Employee Type: *</label>


                <select id='inputEmployeeType4' onChange={this.handleChange.bind(this)} value={this.state.typeId} name="typeId" className='form-control'>
                    {this.state.employeeType.map((e, key) => {
                        return <option key={key} value={e.Id}>{e.TypeName}</option>;
                    })}
                </select>
                </div>
                </div>

                <div className="form-row">
                    <div className='form-group col-md-6' >
                        <label htmlFor='inputSalary4'>Salary: *</label>
                        <input type='number' step="0.01"  className='form-control' id='inputSalary4' onChange={this.handleChange.bind(this)} name="salary" value={this.state.salary} placeholder='Salary' />
                    </div>


                </div>
                <button type="submit" onClick={this.handleSubmit.bind(this)} disabled={this.state.loadingSave} className="btn btn-primary mr-2">{this.state.loadingSave?"Loading...": "Save"}</button>
                <button type="button" onClick={() => this.props.history.push("/employees/index")} className="btn btn-primary">Back</button>
        </form>

</div>;

    return (
        <div>
        <h1 id="tabelLabel" >Employee Create</h1>
        <p>All fields are required</p>
        {contents}
      </div>
    );
  }

    async saveEmployee()
    {
        this.setState({ loadingSave: true });
        const token = await authService.getAccessToken();
        const requestOptions =
        {
        method: 'POST',
        headers: !token ? {} : { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json' },
        body: JSON.stringify(this.state)
        };
        const response = await fetch('api/employees',requestOptions);

        if(response.status === 201){
            this.setState({ loadingSave: false });
            alert("Employee successfully saved");
            this.props.history.push("/employees/index");
        }
        else{
            alert("There was an error occured.");
        }
    }


}
