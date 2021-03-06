import React from 'react'

import Project from '../projects/Project'
import AddProject from '../projects/AddProject'

const currentProjects = (projects) => {
  return projects.length > 0 ?
    <div className="uk-overflow-auto">
      <table className="uk-table uk-table-hover uk-table-middle uk-table-divider uk-table-striped uk-table-responsive">
        <thead>
          <tr>
            <th className="uk-table-expand">Project Name</th>
            <th className="uk-table-expand">Bill Rate</th>
          </tr>
        </thead>
      <tbody>
          {projects.map(p => <Project project={p} />)}
      </tbody>
    </table>
  </div> :
  <h3>Please add a new project!</h3>
}

const Client = ({ client: { id, name, email, projects}}) => 
  <div key={id} className="uk-width-5-10 uk-container-center">
      <h2 className="uk-heading-line uk-text-center padding-top"><span>{name} <h3>{email}</h3></span></h2>
      {currentProjects(projects)}
      <AddProject clientId={id}/>
  </div> 

export default Client
