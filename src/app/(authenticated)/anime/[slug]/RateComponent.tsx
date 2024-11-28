"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Rate, Form, message } from "antd";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Textarea,
} from "@nextui-org/react";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@/utils/auth";
import apiUrl from "@/hooks/api";

interface ReviewModalProps {
  animeId: string; // Tipe untuk animeId
  // onSubmit: () => void; // Tipe untuk fungsi onSubmit
}

const ReviewModal: React.FC<ReviewModalProps> = ({ animeId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (values: { review: string; rating: number }) => {
    try {
      setLoading(true);
      const response = await apiUrl.post(`/review/post`, {
        id_anime: animeId,
        review: values.review,
        rating: values.rating,
      });

      message.success(response.data.message);
      form.resetFields();
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      message.error(error.message);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        onPress={onOpen}
        className="bg-transparent text-xl font-semibold text-[#05E5CB]"
      >
        RATE
      </Button>
      {/* Modal */}
      <Modal
        placement="center"
        aria-labelledby="review-modal"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        classNames={{
          base: "bg-[#023C36] text-white px-6 py-4 p-6 rounded-lg shadow-lg",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2
                  id="modal-title"
                  className="text-2xl font-jakarta font-bold text-[#FFFFFF] tracking-wide"
                >
                  Submit Your Review
                </h2>
              </ModalHeader>
              <ModalBody>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  style={{ maxWidth: "100%" }}
                >
                  {/* Review Input */}
                  <Form.Item name="review">
                    <Textarea
                      classNames={{
                        label:
                          "font-semibold font-jakarta text-white tracking-wide mb-2",
                        input: "bg-[#023C36] text-white placeholder-gray-400 ",
                      }}
                      label="Review"
                      isRequired
                      labelPlacement="outside"
                      maxLength={500}
                      variant="bordered"
                      placeholder="Write a Review"
                    />
                  </Form.Item>

                  {/* Rating Input */}
                  <Form.Item
                    label="Rating"
                    name="rating"
                    rules={[
                      { required: true, message: "Please select a rating" },
                    ]}
                  >
                    <Rate
                      allowHalf
                      count={10}
                      className="text-[#FFD700] hover:text-[#FFC107]"
                    />
                  </Form.Item>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="bg-transparent border border-[#05E1C6] text-[#05E1C6] hover:bg-[#05E1C6] hover:text-white rounded-lg px-6 py-2 transition duration-200"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  className={`rounded-lg px-6 py-2 transition duration-200 ${
                    loading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-[#05E1C6] text-white hover:bg-[#04BFA2]"
                  }`}
                  onPress={() => form.submit()}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ReviewModal;
