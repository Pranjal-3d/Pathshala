import { Coaching } from '../models/Coaching.models.js';

export const getNearbyCoachingCenters = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    const coachingCenters = await Coaching.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 5000 // 5 km radius
        }
      }
    });

    res.json(coachingCenters);
  } catch (error) {
    console.error('Get Nearby Coaching Centers Error:', error);
    res.status(500).json({ message: 'Failed to get nearby coaching centers' });
  }
};