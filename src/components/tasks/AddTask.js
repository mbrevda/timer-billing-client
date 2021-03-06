import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import Select, { Creatable } from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import {fetchClients } from '../../redux/actions/clients/clients'
import apiRequest from '../../redux/modules/apiRequests'


class AddTask extends Component {

  constructor(props){
    super(props)
    this.state = {
      clientData: [],
      clientArray: [],
			projectData: [],
			clientValue: {},
			projectValue: {},
			startDate: moment(),
			bill_time: '',
			description: ''
    }
  }

  isEmpty = (array) => {
    for(var key in array) {
        if(array.hasOwnProperty(key))
            return false;
    }
    return true;
  }

	handleOnChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

	handleOnSubmit = event => {
    event.preventDefault();
    apiRequest.post('tasks/', this.state)
    this.props.router.push('/tasks');
  }

	handleDateChange = date => {
    this.setState({
      startDate: date
    });
  }
  
  convertClientstoDropdown = () => {
    if (!this.isEmpty(this.props.clientArray) && this.isEmpty(this.state.clientData)){
      const clientData =  this.props.clientArray.clients.map(client => {
        var rObj = {};
        rObj["value"] = client.id;
        rObj["label"] = client.name
        return rObj;
      })   
    this.setState({clientData})
	  }
  }

	convertProjectstoDropdown = (clientId) => {
    const projectOfClient = this.props.clientArray.clients.filter(c => c.id === clientId)
		const projectData =  projectOfClient[0].projects.map(project => {
			var rObj = {};
			rObj["value"] = project.id;
			rObj["label"] = project.name
			return rObj;
		})   
	this.setState({projectData})
	}

  componentDidMount = ()=>{
    this.props.fetchClients()
  }

  componentDidUpdate = () => {
    this.convertClientstoDropdown()
  }

	logClientChange = (value) => {
		if (value === null){
			this.setState({clientValue: {}, projectValue: {}, projectData: []})
		} else {
			const clientId = value.value
			this.setState({clientValue: value})
			this.convertProjectstoDropdown(clientId)
		}
  }

	logProjectChange = (value) => {
		if (value === null){
			this.setState({projectValue: {}})
		} else {
		  this.setState({projectValue: value})
		}
  }
  
	projectForm = () => {
		return 	<Creatable
			name={this.state.projectValue.label}
			value={this.state.projectValue.value}
			options={this.state.projectData}
			onChange={this.logProjectChange}
		/> 
	}

	clientForm = () => {
		return this.isEmpty(this.state.clientData) ?
			<h1>Wait for form to load</h1> :

			<Select
				name={this.state.clientValue.label}
				value={this.state.clientValue.value}
				options={this.state.clientData}
				onChange={this.logClientChange}
			/> 
	}
 
  render() {
    return (
      <div className="uk-position-center">
        <form className="uk-form" onSubmit={this.handleOnSubmit}>
          <fieldset className="color-light">
              <legend className="uk-text-center"><h2>Add Task</h2></legend>
              <div className="uk-form-row">
								<legend>Select Client</legend>
								{this.clientForm()}
							</div>
              <div className="uk-form-row">
								<legend>Select Project</legend>
								{this.projectForm()}
							</div>
              <div className="uk-form-row">
								<legend>Description</legend>
                <textarea 
								className="uk-width-2-2"
								placeholder="Description here"
								rows="10"
								name="description"
								onChange={this.handleOnChange}
								/>
              </div>

              <div className="uk-grid uk-form-row">
								<div className="uk-width-1-2">
								  <legend>Select Date</legend>
									<DatePicker
										selected={this.state.startDate}
										onChange={this.handleDateChange}
									/>
								</div>
								<div className="uk-width-1-2">
								  <legend>Billing Time</legend>
										<input
											type="text"
											placeholder="Format in 01:30 or 1.5"
											name="bill_time"
											onChange={this.handleOnChange}
										/> 
								</div>
								<div className="uk-width-2-2 uk-text-center">
									<input
									type="submit"
									value="Save Task" />
								</div>
							</div>
          </fieldset>
        </form>
      </div>
    );
  }
};

const mapStateToProps = state => {
  return { 
    clientArray: state.clients,
    fetchingData: state.fetchingData,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { fetchClients }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(AddTask);
