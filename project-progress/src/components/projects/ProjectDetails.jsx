import React from 'react';
import { connect } from 'react-redux';
import { firestoreConnect }  from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import moment from 'moment';
import '../../index.css';
import CreateMilestone from '../milestones/CreateMilestone';
import MilestoneList from '../milestones/MilestoneList';
import Remove from '../common/Remove';
import Approve from '../common/Approve';
import Status from '../common/Status';
import { toggleProjectStatus } from '../../store/actions/projectActions';
import { deleteProject } from '../../store/actions/projectActions';


const ProjectDetails = (props) => {
    const { projectId, project, auth, milestones, remarks, deleteProject, toggleProjectStatus } = props;

    const handleApprove = (project, projectId) => {
        if (project.status === true ){
        if (window.confirm('Mark this project as InProgress?'))
        toggleProjectStatus(project, projectId);
        }else {
          if (window.confirm('Approve if this project is complete.'))
          toggleProjectStatus(project, projectId);
        }
      }

    const handleDelete = (projectId, milestones) => {
        milestones && milestones.map(milestone=>{
            if (projectId === milestone.projectId){
                alert("Sorry! You can't remove a project that has milestones. Remove the milestones and try again.")
                }
                return null
            })
            if(milestones.length === 0){
                if (window.confirm('Remove this project?')){
                    deleteProject(projectId);
                    props.history.push('/');
                }
            } 
        }

    if (!auth.uid) return <Redirect to = '/signin' />
    
    if (project && auth.uid === project.authorId) {
        return (
            <div className="container section project-details">
                <div className="card z-depth-o grey lighten-3">
                <div className="card-content">
                <span className="card-title">{project.projectTitle}</span>
                <table>
                    <tbody>
                        <tr>
                            <td>
                            <Link to = '/'><i className="material-icons">arrow_back</i></Link>
                            </td>
                            <td>
                            <Status status ={project.status}/>
                            </td>
                            <td>
                            <Approve onClick = {() => handleApprove(project, projectId)} status = {project.status}/>
                            </td>
                            <td>
                            <Remove onClick = {() => handleDelete(projectId, milestones)} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p>{project.projectDesc}</p>
                </div>
                <div className="card-action gret lighten-4 grey-text">
                    <div>{project.authorFirstName}  {project.authorLastName} {project.regNumber} {project.course}</div>
                <div>Project Added On: {moment(project.createdAt.toDate()).calendar()}</div>
                </div>
                <CreateMilestone projectId = {projectId}/>
                <MilestoneList milestones = {milestones} projectId = {projectId} remarks = {remarks}/>
            </div>
            </div> 
        )
    } else {
        return ( 
                <div className='container center cyan-text'>
                    <p>Loading...</p>
                </div>
            );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      deleteProject: (project, projectId) => dispatch(deleteProject(project, projectId)),
      toggleProjectStatus: (project, projectId) => dispatch(toggleProjectStatus(project, projectId))
    }
  }

const mapStateToProps = (state, ownProps) =>{
    const id = ownProps.match.params.id;
    const projects = state.firestore.data.projects;
    const milestones = state.firestore.ordered.milestones;
    const remarks = state.firestore.ordered.remarks;
    const project = projects ? projects[id] : null;
    return {
        projectId: id,
        project: project,
        auth: state.firebase.auth,
        milestones: milestones,
        remarks: remarks
    }
}
 
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect((ownProps) => [ "projects", {
        collection: "projects",
        doc: ownProps.match.params.id,
        subcollections: [{ collection: "milestones" }],
        storeAs: "milestones"
      }, {
        collection: "projects",
        doc: ownProps.match.params.id,
        subcollections: [{ collection: "remarks" }],
        storeAs: "remarks"
      }
 ])
)(ProjectDetails);