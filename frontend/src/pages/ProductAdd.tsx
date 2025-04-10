import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Checkbox, FormControlLabel, Container, Typography } from "@mui/material";
import { addProduct } from "services/shopServices/apiRequestsShop";

export const ProductAddPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("categoryId", String(data.categoryId));
    formData.append("description", data.description || "");
    formData.append("price", String(data.price));
    formData.append("isOnSale", String(data.isOnSale ?? false));
    
    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        console.log("Appending file:", file);
        formData.append("uploaded_images", file);
      });
    }
  
    // DEBUG: View all formData entries
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
        const response = await addProduct(formData);
        if (response && response.status == 201) {
          console.log("OK");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Add Product
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <TextField {...field} label="Name" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} />
          )}
        />
        <Controller
          name="categoryId"
          control={control}
          defaultValue={1}
          rules={{ required: "Category is required" }}
          render={({ field }) => (
            <TextField {...field} label="Category" fullWidth margin="normal" error={!!errors.categoryId} helperText={errors.categoryId?.message} />
          )}
        />
        <Controller
          name="description"
          control={control}
          defaultValue=""
          render={({ field }) => <TextField {...field} label="Description" fullWidth multiline rows={4} margin="normal" />}
        />
        <Controller
          name="price"
          control={control}
          defaultValue={1}
          rules={{ required: "Price is required" }}
          render={({ field }) => (
            <TextField {...field} type="number" label="Price" fullWidth margin="normal" error={!!errors.price} helperText={errors.price?.message} />
          )}
        />
        <Controller
          name="images"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  field.onChange(Array.from(files));
                }
              }}
            />
          )}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
    </Container>
  );
};
