import { Coaching } from '../models/Coaching.models.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const registerCoaching = async (req, res) => {
  try {
    const { name, description, address, subjects, fees, location } = req.body;
    const photos = req.files.map(file => file.path);

    const coaching = new Coaching({
      userId: req.user._id,
      name,
      description,
      address,
      subjects: subjects.split(','),
      fees,
      location: JSON.parse(location),
      photos
    });

    await coaching.save();
    res.status(201).json(coaching);
  } catch (error) {
    console.error('Register Coaching Error:', error);
    res.status(500).json({ message: 'Failed to register coaching center' });
  }
};

export const getCoachingDetails = async (req, res) => {
  try {
    const coaching = await Coaching.findOne({ userId: req.user._id });
    if (!coaching) {
      return res.status(404).json({ message: 'Coaching center not found' });
    }
    res.json(coaching);
  } catch (error) {
    console.error('Get Coaching Details Error:', error);
    res.status(500).json({ message: 'Failed to get coaching details' });
  }
};

export const createPaymentSession = async (req, res) => {
  try {
    const { coachingId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Coaching Service',
            },
            unit_amount: fees * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Create Payment Session Error:', error);
    res.status(500).json({ message: 'Failed to create payment session' });
  }
};