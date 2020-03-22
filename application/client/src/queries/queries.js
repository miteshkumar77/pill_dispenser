import { gql } from 'apollo-boost';

const getDayOfWeeksQuery = gql`
    {
        dayOfWeeks {
            _id,
            medications {
                name,
                count,
                times
            }
        }
    }
`

const addMedicineMutation = gql`
    mutation ($name: String!, $count: Int!, $times: [Int!]!, $dayNames: [String!]!) {
        addNewMedicine(name: $name, count: $count, times: $times, dayNames: $dayNames) {
            name,
            count
        }
    }
`


export { getDayOfWeeksQuery, addMedicineMutation }; 