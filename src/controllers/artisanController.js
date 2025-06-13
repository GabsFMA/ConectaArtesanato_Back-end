import Artisan from "../models/Artisan.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

/**
 * @desc    Busca o perfil público de um artesão pelo ID
 * @route   GET /api/artisans/:id
 * @access  Public
 * Example request to fetch a public artisan profile:
 *   curl -X GET http://localhost:3001/api/artisans/<ARTISAN_ID>
 */
const getPublicArtisanProfile = async (req, res) => {
  try {
    const artisanId = req.params.id;

    // Artisan ID validation
    if (!mongoose.Types.ObjectId.isValid(artisanId)) {
      return res.status(404).json({ message: "Artesão não encontrado." });
    }

    // Select for artisan profile with only public fields
    const artisanProfile = await Artisan.findById(artisanId).select(
      "fullName profilePictureURL personalData.phone story artInfo description"
    );

    if (!artisanProfile) {
      return res.status(404).json({ message: "Artesão não encontrado." });
    }

    // Search for products associated with the artisan
    const products = await Product.find({ artisanId: artisanId });

    // averageRating calculation
    let averageRating = 0;
    if (products.length > 0) {
      let totalRating = 0;
      let productsWithRatings = 0;
      products.forEach((product) => {
        if (product.averageRating > 0) {
          totalRating += product.averageRating;
          productsWithRatings++;
        }
      });
      averageRating =
        productsWithRatings > 0
          ? (totalRating / productsWithRatings).toFixed(1)
          : 0;
    }

    // Construct the public profile object
    const publicProfile = {
      artisan: artisanProfile,
      products: products,
      averageProductRating: averageRating,
    };

    res.status(200).json(publicProfile);
  } catch (error) {
    console.error("Erro ao buscar perfil público do artesão:", error);
    res.status(500).json({ message: "Erro no servidor." });
  }
};

export { getPublicArtisanProfile };
