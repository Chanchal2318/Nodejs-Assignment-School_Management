import db from '../db.js';

// Haversine formula to calculate distance between two lat/lon points
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Returns distance in km
}


// controller to add a new school to the database
const addSchool = (req,res) => {
    const {name, address , latitude, longitude} = req.body;
    // here , we are validating the input data
    if(!name || !address || isNaN(latitude) || isNaN(longitude)){
        return res.status(400).json({error : 'Invalid input data'})
    }

    // Here , we are inserting the school into the database
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?,?,?,?)';
    db.query(query,[name, address, latitude,longitude],(err,result) => {
        if(err){
            return res.status(500).json({error : err.message});
        }
        // Respond with success and the new school ID
        res.status(201).json({message : 'School added successfully', schoolId:result.insertId});
    });
};

const listSchools = (req,res) => {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    // Validate user location input
    if(isNaN(userLat) || isNaN(userLon)){
        return res.status(400).json({error :'Invalid user coordinates'});
    }
    // Fetch all schools from the database
    db.query('SELECT * FROM schools',(err,results) => {
        if(err){
            return res.status(500).json({error: err.message});
        }
        // Compute distance and sort schools by proximity
        const sortedSchools = results.map(school => ({
            ...school, distance:getDistance(userLat, userLon, school.latitude, school.longitude),
        })).sort((a,b) => a.distance - b.distance);

        // Return the sorted list
        res.json(sortedSchools);
    });
};

export { addSchool, listSchools };
