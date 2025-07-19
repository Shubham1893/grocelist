import User from "../models/User.js";

// Get all members of a user's family
export const getFamilyMembers = async (req, res) => {
  try {
    // req.familyId is available from the auth middleware
    const members = await User.find({ familyId: req.familyId }).select("name");

    if (!members) {
      return res.status(404).json({ message: "Could not find family members." });
    }

    const formattedMembers = members.map(member => {
      const firstName = member.name.split(" ")[0];
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff&bold=true`;
      
      return {
        id: member._id,
        firstName,
        avatar: avatarUrl,
      };
    });

    res.status(200).json(formattedMembers);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching family members.", error: error.message });
  }
};