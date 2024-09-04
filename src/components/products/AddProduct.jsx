import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../utils/api'; // Adjust path accordingly
import './addProduct.css';
import { Toast } from '@chakra-ui/react';
const AddProduct = () => {
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [primaryImage, setPrimaryImage] = useState(null);
  const [secondaryImage, setSecondaryImage] = useState(null);
  const [thirdImage, setThirdImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsRes, publishersRes, categoriesRes] = await Promise.all([
          API.get('/authors'),
          API.get('/publishers'),
          API.get('/categories'),
        ]);
        setAuthors(authorsRes.data);
        setPublishers(publishersRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: '',
      primaryImage: '',
      secondaryImage: '',
      thirdImage: '',
      authorId: '',
      description: '',
      categoryId: '',
      publisherId: '',
      publicationDate: '',
      edition: '',
      genres: '',
      otherDetails: '',
      originalPrice: '',
      discount: '',
      awards: [{ awardTitle: '', year: '' }],
      pagesNumber: '',
      language: '',
      copyType: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      authorId: Yup.string().required('Author is required'),
      description: Yup.string().required('Description is required'),
      categoryId: Yup.string().required('Category is required'),
      publisherId: Yup.string().required('Publisher is required'),
      originalPrice: Yup.number().required('Original price is required').positive('Price must be positive'),
      awards: Yup.array().of(
        Yup.object().shape({
          awardTitle: Yup.string().required('Award title is required'),
          year: Yup.number().required('Year is required').positive('Year must be positive').integer('Year must be an integer'),
        })
      ),
      pagesNumber: Yup.number().positive('Pages must be positive').integer('Pages must be an integer'),
      language: Yup.string().required('Language is required'),
      copyType: Yup.string().required('Copy Type is required'),
    }),
    onSubmit: async (values) => {
      try {

        const formData = new FormData();
        formData.append('title', values.title);
        if (primaryImage) formData.append('primaryImage', primaryImage);
        if (secondaryImage) formData.append('secondaryImage', secondaryImage);
        if (thirdImage) formData.append('thirdImage', thirdImage);
        formData.append('authorId', values.authorId);
        formData.append('description', values.description);
        formData.append('categoryId', values.categoryId);
        formData.append('publisherId', values.publisherId);
        formData.append('publicationDate', values.publicationDate);
        formData.append('edition', values.edition);
        formData.append('genres', values.genres);
        formData.append('otherDetails', values.otherDetails);
        formData.append('originalPrice', values.originalPrice);
        formData.append('discount', values.discount);
        formData.append('awards', JSON.stringify(values.awards));
        formData.append('pagesNumber', values.pagesNumber);
        formData.append('language', values.language);
        formData.append('copyType', values.copyType);

        // Debugging: Check FormData contents
        

        const response = await API.post('/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Toast.success('Product added successfully');
        formik.resetForm(); // Optionally reset the form
      } catch (err) {
        console.error('Error adding product:', err);
        Toast.error('An error occurred. Please try again.');
      }
    },
  });

  const handleImageChange = (e, setImage) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
    }
  };

  const handleAddAward = () => {
    formik.setFieldValue('awards', [...formik.values.awards, { awardTitle: '', year: '' }]);
  };

  const handleRemoveAward = (index) => {
    const updatedAwards = formik.values.awards.filter((_, i) => i !== index);
    formik.setFieldValue('awards', updatedAwards);
  };

  const handleAwardChange = (index, field, value) => {
    const updatedAwards = formik.values.awards.map((award, i) =>
      i === index ? { ...award, [field]: value } : award
    );
    formik.setFieldValue('awards', updatedAwards);
  };

  return (
    <div className="add-product-form">
      <h2>Add New Product</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="error">{formik.errors.title}</div>
          ) : null}
        </div>

        {/* Primary Image */}
        <div className="form-group">
          <label htmlFor="primaryImage">Primary Image</label>
          <input
            id="primaryImage"
            name="primaryImage"
            type="file"
            onChange={(e) => handleImageChange(e, setPrimaryImage)}
          />
        </div>

        {/* Secondary Image */}
        <div className="form-group">
          <label htmlFor="secondaryImage">Secondary Image</label>
          <input
            id="secondaryImage"
            name="secondaryImage"
            type="file"
            onChange={(e) => handleImageChange(e, setSecondaryImage)}
          />
        </div>

        {/* Third Image */}
        <div className="form-group">
          <label htmlFor="thirdImage">Third Image</label>
          <input
            id="thirdImage"
            name="thirdImage"
            type="file"
            onChange={(e) => handleImageChange(e, setThirdImage)}
          />
        </div>

        {/* Author */}
        <div className="form-group">
          <label htmlFor="authorId">Author</label>
          <select
            id="authorId"
            name="authorId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.authorId}
          >
            <option value="">Select an Author</option>
            {authors.map((author) => (
              <option key={author._id} value={author._id}>
                {author.firstName}
              </option>
            ))}
          </select>
          {formik.touched.authorId && formik.errors.authorId ? (
            <div className="error">{formik.errors.authorId}</div>
          ) : null}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="error">{formik.errors.description}</div>
          ) : null}
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.categoryId}
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.categoryName}
              </option>
            ))}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId ? (
            <div className="error">{formik.errors.categoryId}</div>
          ) : null}
        </div>

        {/* Publisher */}
        <div className="form-group">
          <label htmlFor="publisherId">Publisher</label>
          <select
            id="publisherId"
            name="publisherId"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.publisherId}
          >
            <option value="">Select a Publisher</option>
            {publishers.map((publisher) => (
              <option key={publisher._id} value={publisher._id}>
                {publisher.publisherName}
              </option>
            ))}
          </select>
          {formik.touched.publisherId && formik.errors.publisherId ? (
            <div className="error">{formik.errors.publisherId}</div>
          ) : null}
        </div>

        {/* Publication Date */}
        <div className="form-group">
          <label htmlFor="publicationDate">Publication Date</label>
          <input
            id="publicationDate"
            name="publicationDate"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.publicationDate}
          />
        </div>

        {/* Edition */}
        <div className="form-group">
          <label htmlFor="edition">Edition</label>
          <input
            id="edition"
            name="edition"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.edition}
          />
        </div>

        {/* Genres */}
        <div className="form-group">
          <label htmlFor="genres">Genres</label>
          <input
            id="genres"
            name="genres"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.genres}
          />
        </div>

        {/* Other Details */}
        <div className="form-group">
          <label htmlFor="otherDetails">Other Details</label>
          <textarea
            id="otherDetails"
            name="otherDetails"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.otherDetails}
          />
        </div>

        {/* Original Price */}
        <div className="form-group">
          <label htmlFor="originalPrice">Original Price</label>
          <input
            id="originalPrice"
            name="originalPrice"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.originalPrice}
          />
          {formik.touched.originalPrice && formik.errors.originalPrice ? (
            <div className="error">{formik.errors.originalPrice}</div>
          ) : null}
        </div>

        {/* Discount */}
        <div className="form-group">
          <label htmlFor="discount">Discount</label>
          <input
            id="discount"
            name="discount"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.discount}
          />
        </div>

        {/* Awards */}
        {formik.values.awards.map((award, index) => (
          <div key={index} className="award-form">
            <div className="form-group">
              <label htmlFor={`awardTitle-${index}`}>Award Title</label>
              <input
                id={`awardTitle-${index}`}
                name={`awards[${index}].awardTitle`}
                type="text"
                onChange={(e) => handleAwardChange(index, 'awardTitle', e.target.value)}
                onBlur={() => formik.setFieldTouched(`awards[${index}].awardTitle`)}
                value={award.awardTitle}
              />
              {formik.touched.awards?.[index]?.awardTitle && formik.errors.awards?.[index]?.awardTitle ? (
                <div className="error">{formik.errors.awards[index].awardTitle}</div>
              ) : null}
            </div>

            <div className="form-group">
              <label htmlFor={`awardYear-${index}`}>Year</label>
              <input
                id={`awardYear-${index}`}
                name={`awards[${index}].year`}
                type="number"
                onChange={(e) => handleAwardChange(index, 'year', e.target.value)}
                onBlur={() => formik.setFieldTouched(`awards[${index}].year`)}
                value={award.year}
              />
              {formik.touched.awards?.[index]?.year && formik.errors.awards?.[index]?.year ? (
                <div className="error">{formik.errors.awards[index].year}</div>
              ) : null}
            </div>

            <button type="button" onClick={() => handleRemoveAward(index)}>Remove Award</button>
          </div>
        ))}
        <button type="button" onClick={handleAddAward}>Add Award</button>

        {/* Pages Number */}
        <div className="form-group">
          <label htmlFor="pagesNumber">Pages Number</label>
          <input
            id="pagesNumber"
            name="pagesNumber"
            type="number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.pagesNumber}
          />
        </div>

        {/* Language */}
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <input
            id="language"
            name="language"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.language}
          />
        </div>

        {/* Copy Type */}
        <div className="form-group">
          <label htmlFor="copyType">Copy Type</label>
          <input
            id="copyType"
            name="copyType"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.copyType}
          />
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
