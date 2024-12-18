import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem, i) => {

                const orderStatus = orderItem?.orderStatus
                let orderClass = "bg-black"; // Default class
                if (orderStatus === "confirmed") {
                  orderClass = "bg-green-500";
                } else if (orderStatus === "rejected") {
                  orderClass = "bg-red-600";
                } else if (orderStatus === "delivered") {
                  orderClass = "bg-green-600";
                } else if (orderStatus === "inShipping") {
                  orderClass = "bg-blue-600";
                } else if (orderStatus === "inProcess") {
                  orderClass = "bg-indigo-400";
                }

                return (
                  <TableRow key={i}>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${orderClass}`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>

                      <Button
                        onClick={() =>
                          handleFetchOrderDetails(orderItem?._id)
                        }
                      >
                        View Details
                      </Button>
                        <AdminOrderDetailsView orderDetails={orderDetails} 
                                                openDetailsDialog={openDetailsDialog}
                                                onOpenChange={() => {
                                                  setOpenDetailsDialog(false);
                                                  dispatch(resetOrderDetails());
                                                }}
                        />
                    </TableCell>
                  </TableRow>
                )
              })
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
