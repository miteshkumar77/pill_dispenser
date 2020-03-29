import { gql } from 'apollo-boost';

const getDayOfWeeksQuery = gql`
    {
        dayOfWeeks {
            _id,
            medications {
                name,
                count,
                times,
                dose
            }
        }
    }
`

const getMedicinesQuery = gql`
    {
        medicines{
            id,
            count,
            dose,
            name,
            times,
            days {
                _id
            }
        }
    }
`

const addMedicineMutation = gql`
    mutation ($name: String!, $count: Int!, $dose: Int!, $times: [Int!]!, $dayNames: [String!]!) {
        addNewMedicine(name: $name, count: $count, dose: $dose, times: $times, dayNames: $dayNames) {
            name,
            count,
            dose
        }
    }
`

const deleteMedicineMutation = gql`
    mutation ($id: ID!) {
        deleteMedicine(id: $id) {
            name
        }
    }
`
const editPillCountMutation = gql`
    mutation ($id: ID!, $update: Int!) {
        editPillCount (id: $id, update: $update) {
            id,
            count
        }
    }
`



export { 
    getDayOfWeeksQuery, 
    addMedicineMutation, 
    getMedicinesQuery, 
    deleteMedicineMutation,
    editPillCountMutation 
}; 