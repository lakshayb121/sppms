const initState = {}

const projectReducer = (state = initState, action) =>{
    switch(action.type){
        case 'ADD_PROJECT':
            return state;
        case 'ADD_PROJECT_ERROR':
            return state;
        case 'REMOVE_PROJECT':
            return state;
        case 'REMOVE_PROJECT_ERROR':
            return{
                ...state,
                removeError: action.type.message
            }
        default:
            return state;
    }
}

export default projectReducer;