import { useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';

import { GET_USER_PETS } from '../graphql/queries';
import { CREATE_POST } from '../graphql/mutations';

import { Pet } from '../interfaces';

const initialFormData = {
  title: '',
  body: '',
  errorMessage: '' 
};

function Dashboard() {
  const { data: petData } = useQuery(GET_USER_PETS);
  const [createPost] = useMutation(CREATE_POST);
  const [formData, setFormData] = useState(initialFormData)
  const [selectedPet, setSelectedPet] = useState<null | Pet>(null);
  const [show, setShow] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  const handleSubmit = async () => {

    try {
      await createPost({
        variables: {
          ...formData,
          pet: selectedPet?._id
        }
      });

      handleModalClose();
    } catch (error: any) {
      setFormData({
        ...formData,
        errorMessage: error.message
      });
    }
  }

  const handleModalClose = () => setShow(false);

  const handleShowModal = (pet: Pet) => {
    setSelectedPet(pet);

    setShow(true)
  };

  return (
    <Container>
      <h3 className="mt-4 fw-light">Your Pets</h3>
      <hr />

      <section className="d-grid gap-4 pet-output">
        {petData && petData.getUserPets.map((pet: Pet) => (
          <article key={pet._id} className="border p-4">
            <h4>{pet.name}</h4>
            <p>Type: {pet.type}</p>
            <p>Age: {pet.age}</p>
            <Button 
            variant="primary" 
            className="me-3" 
            onClick={() => handleShowModal(pet)}>Create Post</Button>
            <Button variant="secondary" className="me-2">View Posts</Button>
            <Button variant="danger">Remove Pet</Button>
          </article>
        ))}
      </section>

      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create post for {selectedPet?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                type="text"
                placeholder="Enter the title of your post"
                autoFocus
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Enter the post details</Form.Label>
              <Form.Control name="body" onChange={handleInputChange} as="textarea" placeholder="Type your details" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add Post
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Dashboard;