const graphql = require('graphql');
const Medicine = require('../models/medicine');
const DayOfWeek = require('../models/dayOfWeek'); 

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const MedicineType = new GraphQLObjectType({
    name: 'Medicine',
    fields: () => ({
        id: { 
            type: GraphQLID,
            resolve(parent, args) {
                return parent._id; 
            } 
        },
        count: { type: GraphQLInt },
        name: { type: GraphQLString },
        times: { type: GraphQLList(GraphQLInt) },
        days: { 
            type: GraphQLList(DayOfWeekType),
            resolve(parent, args) {
                return (parent.dayNames.map(dayName => DayOfWeek.findById(dayName))); 
            }
        }
    })
});

const DayOfWeekType = new GraphQLObjectType({
    name: "DayOfWeek",
    fields: () => ({
        _id: { type: GraphQLString },
        medications: {
            type: GraphQLList(MedicineType),
            resolve(parent, args) {
                return Medicine.find({ dayNames: parent._id }); 
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        medicine: {
            type: MedicineType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                return Medicine.findById(args.id);
            }
        },

        dayOfWeek: {
            type: DayOfWeekType,
            args: { name: { type: GraphQLString }},
            resolve(parent, args) {
                return DayOfWeek.findById(args.name); 
            }
        }, 

        medicines: {
            type: new  GraphQLList(MedicineType),
            resolve(parent, args) {
                return Medicine.find({});
            }
        },

        dayOfWeeks: {
            type: new GraphQLList(DayOfWeekType),
            resolve(parent, args) {
                return DayOfWeek.find({}); 
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addDayOfWeek: {
            type: DayOfWeekType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let dayOfWeek = new DayOfWeek({
                    _id: args.name,
                });
                
                return dayOfWeek.save(); 
            }
        },

        addNewMedicine: {
            type: MedicineType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                count: { type: new GraphQLNonNull(GraphQLInt) },
                times: { type: new GraphQLNonNull(GraphQLList(GraphQLInt))},
                dayNames: { type: new GraphQLNonNull(GraphQLList(GraphQLString))}
            },

            resolve (parent, args) {
                let medicine = new Medicine({
                    name: args.name,
                    count: args.count,
                    times: args.times,
                    dayNames: args.dayNames
                }); 
                
                return medicine.save(); 
            }
        },

        editPillCount: {
            type: MedicineType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                update: { type: new GraphQLNonNull(GraphQLInt) }
            },

            async resolve (parent, args) {

                try {
                    let res =  await Medicine.findByIdAndUpdate(
                        args.id,
                        { $inc: { count: args.update }},
                        { new: true, useFindAndModify: false }
                    );

                    if (res.count < 0) {
                        res = null; 
                        await Medicine.findByIdAndDelete(args.id); 
                    }

                    return res; 
                } catch(err) {
                    console.error(err); 
                    console.log('Medicine with this id does not exist. Cannot be modified.');
                    return null; 
                }
            }
        },

        deleteMedicine: {
            type: MedicineType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID)}
            },

            async resolve (parent, args) {
                try {
                    let res = await Medicine.findByIdAndDelete(args.id);
                    return res; 
                } catch (err) {
                    console.log('Medicine with this id does not exist. Cannot be deleted');
                    return null; 
                }
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
}); 


