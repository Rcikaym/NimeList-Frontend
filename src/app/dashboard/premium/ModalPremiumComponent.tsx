import {
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
} from "antd";
import { DataPremiumType } from "./premium";
import { Option } from "antd/es/mentions";

export const PremiumModalForm: React.FC<{
  visible: boolean;
  mode: "post" | "edit";
  form: FormInstance;
  onSubmit: (values: DataPremiumType) => void;
  onCancel: () => void;
}> = ({ visible, mode, form, onSubmit, onCancel }) => (
  <Modal
    title={`${mode === "post" ? "Add" : "Edit"} Premium`}
    centered
    open={visible}
    onOk={() =>
      form
        .validateFields()
        .then(onSubmit)
        .catch(() =>
          message.error("Please complete the form before submitting!")
        )
    }
    onCancel={onCancel}
  >
    <Form form={form} layout="vertical" className="mt-3">
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please input premium name!" }]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item
        name="price"
        label="Price"
        rules={[{ required: true, message: "Please input premium price!" }]}
      >
        <InputNumber prefix="Rp." min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="duration"
        label="Duration (+1)"
        rules={[{ required: true, message: "Please input premium duration!" }]}
      >
        <InputNumber suffix="Days" min={1} style={{ width: "100%" }} />
      </Form.Item>
      {mode === "edit" && (
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please input premium status!" }]}
        >
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>
      )}
    </Form>
  </Modal>
);
