"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, message, Modal, Typography } from "antd";
import type { TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import {
  AiOutlineClockCircle,
  AiOutlineComment,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineTag,
  AiOutlineTool,
} from "react-icons/ai";
import { AppstoreFilled, ExclamationCircleFilled } from "@ant-design/icons";
import Link from "next/link";
import { CustomTable } from "@/components/CustomTable";
import renderDateTime from "@/utils/FormatDateTime";
import DisplayLongText from "@/components/DisplayLongText";
import useDebounce from "@/utils/useDebounce";
import apiUrl from "@/hooks/api";

const { Text } = Typography;

interface DataType {
  id: string;
  topic: string;
  user: string;
  created_at: string;
  updated_at: string;
}

interface DataEdit {
  comment: string;
}

const TopicCommentList: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]); // Data diisi dengan api
  const [loading, setLoading] = useState<boolean>(true); // Untuk status loading
  const [detailComment, setDetailComment] = useState<any>(null);
  const [modalMode, setMode] = useState<"edit" | "detail">();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [idComment, setId] = useState<string>("");
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState<string>("");
  const debounceText = useDebounce(searchText, 1500);

  const showModal = (modalMode: "edit" | "detail") => {
    setMode(modalMode);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleOk = () => {
    if (modalMode === "detail") {
      setModalVisible(false); // Untuk mode detail, tidak perlu submit
      return;
    }
    form
      .validateFields()
      .then((values: any) => {
        if (modalMode === "edit") {
          showEditConfirm(values);
        }
        setModalVisible(false);
        form.resetFields();
      })
      .catch(() => {
        message.error("Please complete the form before submitting!");
      });
  };

  // Set data detail comment
  const setDataDetail = async (id: string) => {
    const res = await apiUrl.get(`/comment/get/${id}`);
    setDetailComment(await res.data);
  };

  const setDataEdit = async (id: string) => {
    setId(id);
    const res = await apiUrl.get(`/comment/get/${id}`);
    const { comment } = await res.data;
    // Set data ke dalam form
    form.setFieldsValue({
      comment: comment,
    });
  };

  const handleEditComment = async (values: DataEdit) => {
    setLoading(true);
    try {
      const res = await apiUrl.put(`/comment/update/${idComment}`, values); // Melakukan PUT ke server
      message.success(res.data.message);
      setModalVisible(false);

      // Fetch ulang data setelah update
      fetchComment();
      form.resetFields(); // Reset form setelah submit

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to update comment");
    }
  };

  const showEditConfirm = (values: DataEdit) => {
    confirm({
      centered: true,
      title: "Do you want to update this comment ?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        setLoading(true); // Set status loading pada tombol OK

        return handleEditComment(values)
          .then(() => {
            setLoading(false); // Set loading ke false setelah selesai
          })
          .catch(() => {
            setLoading(false); // Set loading ke false jika terjadi error
          });
      },
    });
  };

  const fetchComment = async () => {
    try {
      const response = await apiUrl.get(
        `/comment/get-admin?page=${pagination.current}&limit=${pagination.pageSize}&search=${debounceText}`
      );
      const { data, total } = await response.data;
      setData(data); // Mengisi data dengan hasil dari API
      setPagination({
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: total,
      });
      setLoading(false); // Menonaktifkan status loading setelah data didapat
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false); // Tetap menonaktifkan loading jika terjadi error
    }
  };

  useEffect(() => {
    fetchComment();
  }, [JSON.stringify(pagination), debounceText]);

  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination: TablePaginationConfig
  ) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
  };

  // Fungsi untuk melakukan delete data comment
  const handleDeleteComment = async (id: string) => {
    setLoading(true);
    try {
      const res = await apiUrl.delete(`/comment/delete/${id}`); // Melakukan DELETE ke server
      message.success(res.data.message);

      // Fetch ulang data setelah di delete
      fetchComment();

      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to delete comment");
    }
  };

  // Fungsi untuk menampilkan modal konfirmasi sebelum submit
  const showDeleteConfirm = (id: string) => {
    confirm({
      centered: true,
      title: "Do you want to delete this comment?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        handleDeleteComment(id);
      },
    });
  };

  // Fungsi untuk potong title jika panjangnya melebihi batas
  function truncateText(text: string, maxLength = 20) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  // Kolom table
  const columns: TableColumnsType<DataType> = [
    {
      title: "Title Topic",
      dataIndex: "topic",
      render: (text: string) => truncateText(text),
    },
    {
      title: "Username",
      dataIndex: "user",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (text: string) => renderDateTime(text),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      render: (text: string) => renderDateTime(text),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text: string, record: DataType) => (
        <div className="flex gap-3">
          <button
            type="button"
            className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800"
            onClick={() => {
              showModal("detail");
              setDataDetail(record.id);
            }}
          >
            <AiOutlineEye style={{ fontSize: 20 }} />
          </button>
          <button
            type="button"
            className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800"
            onClick={() => {
              showModal("edit");
              setDataEdit(record.id);
            }}
          >
            <AiOutlineEdit style={{ fontSize: 20 }} />
          </button>
          <button
            type="button"
            className="bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800"
            onClick={() => showDeleteConfirm(record.id)}
          >
            <AiOutlineDelete style={{ fontSize: 20 }} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center mb-10 mt-3 justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-700 rounded-lg p-3 shadow-lg shadow-gray-300 text-white">
            <AiOutlineComment style={{ fontSize: 20 }} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">
              Comment Topic Information
            </span>
            <span className="text-sm">Displays comment topic information</span>
          </div>
        </div>
        <div className="items-center flex gap-3">
          <Link href="/dashboard" className="hover:text-emerald-700">
            <AppstoreFilled style={{ fontSize: 18 }} />
          </Link>
          <span> / </span>
          <span className="text-lg"> Manage Topic </span>
          <span> / </span>
          <Link
            href="/dashboard/topic/comment"
            className="hover:text-emerald-700"
          >
            <span className="text-lg">Comment Topic</span>
          </Link>
        </div>
      </div>
      <div className="mb-3 flex justify-end">
        <div>
          <Input
            addonBefore={<AiOutlineSearch />}
            placeholder="Only title topic and username"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <CustomTable
        columns={columns}
        onChange={handleTableChange}
        pagination={pagination}
        data={data} // Data dari state
      />

      {/* Modal dynamic mode */}
      <Modal
        title={`${modalMode === "detail" ? "Detail" : "Edit"} Comment Topic`}
        centered
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelButtonProps={{
          style: modalMode === "detail" ? { display: "none" } : {},
        }}
        okButtonProps={{
          style: modalMode === "detail" ? { display: "none" } : {},
        }}
      >
        {modalMode === "detail" && detailComment ? (
          <div className="flex flex-col w-full h-full">
            <div className="flex flex-col gap-3 mb-3">
              <div className="flex gap-2 items-center">
                <AiOutlineTag size={19} />
                <div className="break-words w-full">
                  <span> {detailComment.topic}</span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <AiOutlineHeart size={19} />
                <Text>{detailComment.likes}</Text>
              </div>
            </div>

            <div className="bg-gray-100 p-3 w-full h-full rounded-md">
              <DisplayLongText text={detailComment.comment} />
            </div>

            <div className="flex gap-2 mt-3">
              <div className="flex gap-2 items-center">
                <AiOutlineClockCircle size={15} />
                <Text type="secondary">
                  {renderDateTime(detailComment.created_at)}
                </Text>
              </div>
              <div className="flex gap-2 items-center">
                <AiOutlineTool size={15} />
                <Text type="secondary">
                  {renderDateTime(detailComment.updated_at)}
                </Text>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {modalMode === "edit" ? (
          <Form form={form} layout="vertical" className="w-full p-3">
            {/* Input review */}
            <Form.Item
              label="Comment"
              name="comment"
              rules={[{ required: true, message: "Please input comment" }]}
            >
              <Input.TextArea showCount maxLength={9999} autoSize />
            </Form.Item>
          </Form>
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};

export default TopicCommentList;
