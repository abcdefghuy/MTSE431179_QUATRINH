import React from "react";
import { Pagination, Switch, Typography, Select, Card, Divider } from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  ThunderboltOutlined,
  BarsOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  isInfiniteScroll: boolean;
  onPageChange: (page: number) => void;
  onToggleMode: (isInfiniteScroll: boolean) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  isInfiniteScroll,
  onPageChange,
  onToggleMode,
  onPageSizeChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const pageSizeOptions = [
    { label: "10 sản phẩm/trang", value: 10 },
    { label: "20 sản phẩm/trang", value: 20 },
    { label: "30 sản phẩm/trang", value: 30 },
    { label: "50 sản phẩm/trang", value: 50 },
  ];

  return (
    <Card className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-indigo-200/20 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <SettingOutlined className="text-white text-lg" />
            </div>
            <div>
              <Text className="text-lg font-bold text-gray-800">
                Điều khiển hiển thị
              </Text>
              <Text className="text-sm text-gray-500 block">
                Hiển thị {startItem}-{endItem} trong tổng số {totalItems} sản
                phẩm
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <Text className="text-sm text-gray-500">Hoạt động</Text>
          </div>
        </div>

        <Divider className="my-6" />

        {/* Mode Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                {isInfiniteScroll ? (
                  <ThunderboltOutlined className="text-white" />
                ) : (
                  <BarsOutlined className="text-white" />
                )}
              </div>
              <div>
                <Text className="font-semibold text-gray-800">
                  Chế độ hiển thị
                </Text>
                <Text className="text-sm text-gray-500 block">
                  {isInfiniteScroll
                    ? "Tự động tải thêm khi cuộn"
                    : "Phân trang truyền thống"}
                </Text>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <UnorderedListOutlined
                  className={`text-lg ${
                    !isInfiniteScroll ? "text-indigo-600" : "text-gray-400"
                  }`}
                />
                <Text
                  className={`text-sm font-medium ${
                    !isInfiniteScroll ? "text-indigo-600" : "text-gray-400"
                  }`}
                >
                  Phân trang
                </Text>
              </div>

              <Switch
                checked={isInfiniteScroll}
                onChange={onToggleMode}
                className="bg-gradient-to-r from-indigo-500 to-emerald-500"
                size="default"
              />

              <div className="flex items-center gap-2">
                <AppstoreOutlined
                  className={`text-lg ${
                    isInfiniteScroll ? "text-indigo-600" : "text-gray-400"
                  }`}
                />
                <Text
                  className={`text-sm font-medium ${
                    isInfiniteScroll ? "text-indigo-600" : "text-gray-400"
                  }`}
                >
                  Tự động
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        {!isInfiniteScroll && (
          <div className="space-y-6">
            {/* Page Size Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <SettingOutlined className="text-white" />
                </div>
                <div>
                  <Text className="font-semibold text-gray-800">
                    Số sản phẩm mỗi trang
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Chọn số lượng sản phẩm hiển thị
                  </Text>
                </div>
              </div>

              <Select
                value={itemsPerPage}
                onChange={onPageSizeChange}
                className="w-48"
                size="large"
                options={pageSizeOptions}
                suffixIcon={<SettingOutlined className="text-indigo-500" />}
              />
            </div>

            {/* Show pagination only if there are multiple pages */}
            {totalPages > 1 && (
              <>
                <Divider className="my-4" />

                {/* Pagination */}
                <div className="flex justify-center">
                  <Pagination
                    current={currentPage}
                    total={totalItems}
                    pageSize={itemsPerPage}
                    onChange={onPageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total, range) => (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>
                          Trang {range[0]}-{range[1]} của {total}
                        </span>
                      </div>
                    )}
                    className="modern-pagination"
                    itemRender={(page, type, originalElement) => {
                      if (type === "prev") {
                        return (
                          <div className="flex items-center justify-center w-10 h-10 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 cursor-pointer">
                            <span className="text-indigo-600 font-semibold">
                              ‹
                            </span>
                          </div>
                        );
                      }
                      if (type === "next") {
                        return (
                          <div className="flex items-center justify-center w-10 h-10 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 cursor-pointer">
                            <span className="text-indigo-600 font-semibold">
                              ›
                            </span>
                          </div>
                        );
                      }
                      if (type === "page") {
                        return (
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer ${
                              page === currentPage
                                ? "bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-lg"
                                : "bg-white border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 text-indigo-600"
                            }`}
                          >
                            <span className="font-semibold">{page}</span>
                          </div>
                        );
                      }
                      return originalElement;
                    }}
                  />
                </div>
              </>
            )}

            {/* Show info when all items fit in one page */}
            {totalPages <= 1 && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-full border border-emerald-200">
                  <SettingOutlined className="text-emerald-500" />
                  <Text className="text-emerald-700 font-medium">
                    Hiển thị tất cả {totalItems} sản phẩm trong 1 trang
                  </Text>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Infinite Scroll Info */}
        {isInfiniteScroll && (
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-full border border-indigo-200">
              <ThunderboltOutlined className="text-indigo-500" />
              <Text className="text-indigo-700 font-medium">
                Chế độ tự động tải - Cuộn xuống để xem thêm
              </Text>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .modern-pagination .ant-pagination-item {
          border: none !important;
          background: transparent !important;
        }

        .modern-pagination .ant-pagination-item-link {
          border: none !important;
          background: transparent !important;
        }

        .modern-pagination .ant-pagination-jump-prev,
        .modern-pagination .ant-pagination-jump-next {
          border: none !important;
          background: transparent !important;
        }

        .modern-pagination .ant-pagination-options {
          display: none !important;
        }
      `}</style>
    </Card>
  );
};

export default PaginationControls;
