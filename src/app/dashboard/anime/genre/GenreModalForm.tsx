import {
  Form,
  FormInstance,
  Input,
  Modal,
} from "antd";

const GenreModalForm: React.FC<{
  visible: boolean;
  mode: "post" | "edit";
  form: FormInstance;
  onSubmit: () => void;
  onCancel: () => void;
}> = ({ visible, mode, form, onSubmit, onCancel }) => (
  <Modal
    title={mode === "post" ? "Add Genre" : "Edit Genre"}
    centered
    open={visible}
    onOk={onSubmit}
    onCancel={onCancel}
  >
    <Form form={form} layout="vertical" className="mt-3">
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input genre name!" }]}
      >
        <Input type="text"></Input>
      </Form.Item>
    </Form>
  </Modal>
);

export default GenreModalForm;
