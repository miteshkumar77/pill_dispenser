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
        dose: { type: GraphQLInt },
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

                return (parent.medicineIds.map(medicineId => Medicine.findById(medicineId)));
                // return Medicine.find({ dayNames: parent._id }); 
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
                    medicineIds: [] 
                });
                
                return dayOfWeek.save(); 
            }
        },

        addNewMedicine: {
            type: MedicineType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                count: { type: new GraphQLNonNull(GraphQLInt) },
                dose: { type: new GraphQLNonNull(GraphQLInt) },
                times: { type: new GraphQLNonNull(GraphQLList(GraphQLInt))},
                dayNames: { type: new GraphQLNonNull(GraphQLList(GraphQLString))}
            },

            async resolve (parent, args) {
                let medicine = new Medicine({
                    name: args.name,
                    count: args.count,
                    dose: args.dose,
                    times: args.times,
                    dayNames: args.dayNames
                }); 
                
                await Promise.all(args.dayNames.map(dayName => {
                    return DayOfWeek.findOneAndUpdate({ _id: dayName }, { $push: { medicineIds: medicine._id }});
                })).catch((err) => console.error(err)); 

                return await medicine.save(); 
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
                id: { type: new GraphQLNonNull(GraphQLID) }
            },

            async resolve (parent, args) {



                const doc = await Medicine.findOneAndRemove({ _id: args.id });
                if (doc) {
                    await Promise.all(doc.dayNames.map(async dayName => {
                        try {
                            return DayOfWeek.findByIdAndUpdate(dayName, { $pull: { medicineIds: doc._id } });
                        }
                        catch (error1) {
                            return console.error(error1);
                        }
                    })).catch((error2) => console.error(error2));
                }
                return doc; 
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
}); 


