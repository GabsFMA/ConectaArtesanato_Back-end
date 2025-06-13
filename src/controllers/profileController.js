import Client from "../models/Client.js";
import Artisan from "../models/Artisan.js";
import Product from "../models/Product.js";

/**
 * @desc    Select logged user's profile
 * @route   GET /api/profile/me
 * @access  Private
 * Example request body for fetching the profile:
 *   curl -X GET -H "Authorization: Bearer <USER_JWT_TOKEN>" \
 *   http://localhost:3001/api/profile/me
 */
const getMyProfile = async (req, res) => {
  // Try to fetch the profile based on the user's role
  try {
    let profile;
    if (req.user.role === "artisan") {
      profile = await Artisan.findById(req.user.id);

      // Fetch products associated with the artisan
      const products = await Product.find({ artisanId: req.user.id });
      // Add averageProductRating to the profile
      if (products.length > 0) {
        let totalRating = 0;
        let productsWithRatings = 0;
        products.forEach((product) => {
          if (product.averageRating > 0) {
            totalRating += product.averageRating;
            productsWithRatings++;
          }
        });
        profile.averageProductRating =
          productsWithRatings > 0 ? totalRating / productsWithRatings : 0;
      }
    } else {
      profile = await Client.findById(req.user.id);
    }

    if (!profile) {
      return res.status(404).json({ message: "Perfil não encontrado." });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor ao buscar perfil." });
  }
};

/**
 * @desc    Update logged user's profile
 * @route   PUT /api/profile/me
 * @access  Private
 * Example request body for updating the profile:
 * curl -X PUT -H "Authorization: Bearer <USER_JWT_TOKEN>" \
 *   -H "Content-Type: application/json" \
 *   #For Client: -d '{"fullName": "New Name", "phone": ["+5571999998888"]}' \
 *   #For Artisan: -d '{"fullName": "New Name", "artInfo": "New Art Info", "description": "New Description", "addresses": [{"street": "New Street", "number": 456, "city": "New City", "state": "New State", "zip": "65432-109"}], "phone": ["+5571999998888"]}' \
 *   http://localhost:3001/api/profile/me
 */
const updateMyProfile = async (req, res) => {
  // Try to update the profile based on the user's role
  try {
    const { fullName, artInfo, description, addresses, phone } = req.body;

    const fieldsToUpdate = { fullName, addresses, phone };

    // Validate fields to update based on user role
    let userModel;
    if (req.user.role === "artisan") {
      userModel = Artisan;
      fieldsToUpdate.artInfo = artInfo;
      fieldsToUpdate.description = description;
    } else {
      userModel = Client;
    }

    // Profile update logic
    const profile = await userModel.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: "Perfil não encontrado." });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor ao atualizar perfil." });
  }
};

export { getMyProfile, updateMyProfile };
