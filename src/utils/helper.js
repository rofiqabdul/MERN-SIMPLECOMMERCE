export const cleanImageUrl = (base, imagePath) => {
	return base.replace(/\/$/, "") + imagePath.replace(/^\//, "");
};
