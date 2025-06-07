"use client";

import React from "react";
import { HeadingAndSubheading } from "./heading-and-subheading";
import DynamicFormField from "../forms/dynamic-form-field";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { ProductEditorSharedProps } from "@/@types/admin/product";
import { useProductEditor } from "./use-producteditor";
import ProductMediaUploader from "./product-media-uploader";

const ProductEditorElements = ({
  displayType,
  productStatus,
  initialValues,
}: ProductEditorSharedProps) => {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    handleProductSubmit,
    handleDeleteProduct,
    handleDeleteProductImage,
    closeModal,
    currentProductImages,
    setUploadedImages,
  } = useProductEditor({ displayType, productStatus, initialValues });

  return (
    <>
      <HeadingAndSubheading
        heading={
          productStatus === "new-product"
            ? "Create a new product"
            : "Edit product"
        }
        subheading={
          productStatus === "new-product"
            ? "Enter the details of your new product below and click save."
            : "Edit the details of your product below and click save."
        }
      />

      <form onSubmit={handleSubmit(handleProductSubmit)}>
        <div className="flex flex-col gap-6 mt-2 mb-6">
          <DynamicFormField
            showLabel
            inputType="input"
            label="Product Name"
            name="name"
            register={register}
            errors={errors}
            type="text"
            fieldProps={{
              placeholder: "Enter a product name*",
              disabled: false,
            }}
          />
          <DynamicFormField
            showLabel
            inputType="textarea"
            label="Description"
            name="description"
            register={register}
            errors={errors}
            lines={8}
            fieldProps={{
              placeholder: "Enter a product description*",
            }}
          />

          <div className="flex flex-wrap">
            {productStatus === "existing-product" &&
              initialValues &&
              initialValues.images && (
                <ProductMediaUploader
                  productId={initialValues?.id as string}
                  setUploadedImages={setUploadedImages}
                  currentProductImages={currentProductImages}
                  handleDeleteProductImage={handleDeleteProductImage}
                />
              )}
          </div>

          <div className="flex  gap-x-4">
            <DynamicFormField
              showLabel
              inputType="input"
              label="Price"
              name="price"
              register={register}
              errors={errors}
              type="number"
              fieldProps={{
                placeholder: "Enter a product price*",
                disabled: false,
              }}
            />
            <DynamicFormField
              showLabel
              inputType="input"
              label="Quantity In Stock"
              name="inventory"
              register={register}
              errors={errors}
              type="number"
              fieldProps={{
                placeholder: "Enter a product quantity*",
                disabled: false,
              }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          {!!initialValues && (
            <Button
              type="button"
              variant="destructiveOutline"
              onClick={() => handleDeleteProduct(initialValues.id)}
            >
              Delete
            </Button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex gap-2 items-center justify-center"
            >
              {!!isSubmitting && <Loader2 size={18} className="animate-spin" />}
              {initialValues ? "Save" : "Create"}
            </Button>
          </div>
        </div>
        {/* <div className="flex flex-col gap-6 mt-2 mb-6">
          <DynamicFormField
            showLabel
            inputType="input"
            label="Product Name"
            name="name"
            register={register}
            errors={errors}
            type="text"
            fieldProps={{
              placeholder: "Enter a product name*",
              disabled: false,
            }}
          />
          <DynamicFormField
            showLabel
            inputType="textarea"
            label="Description"
            name="description"
            register={register}
            errors={errors}
            lines={8}
            fieldProps={{ placeholder: "Enter a product description*" }}
          />

          <div className="flex flex-wrap">
            {productStatus === "existing-product" &&
              initialValues &&
              initialValues.images && (
                <ProductImageUploader
                  productId={initialValues?.id as string}
                  setUploadedImages={setUploadedImages}
                  currentProductImages={currentProductImages}
                  // setCurrentProductImages={setUploadedImages}
                  handleDeleteProductImage={handleDeleteProductImage}
                />
              )}
          </div>

          <div className="flex  gap-x-4">
            <DynamicFormField
              showLabel
              inputType="input"
              label="Price"
              name="price"
              register={register}
              errors={errors}
              type="number"
              fieldProps={{
                placeholder: "Enter a product price*",
                disabled: false,
              }}
            />
            <DynamicFormField
              showLabel
              inputType="input"
              label="Quantity In Stock"
              name="inventory"
              register={register}
              errors={errors}
              type="number"
              fieldProps={{
                placeholder: "Enter a product quantity*",
                disabled: false,
              }}
            />
          </div>

          <div className="flex justify-between items-center">
            {initialValues && (
              <Button
                type="button"
                variant="destructiveOutline"
                onClick={() => handleDeleteProduct(initialValues.id)}
              >
                Delete
              </Button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex gap-2 items-center justify-center"
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                {initialValues ? "Save" : "Create"}
              </Button>
            </div>
          </div>
        </div> */}
      </form>
    </>
  );
};

export default ProductEditorElements;
