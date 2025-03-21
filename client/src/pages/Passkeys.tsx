import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IPasskey } from "@/types/passkey";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Passkeys = () => {
  const [passkeys, setPasskeys] = useState<IPasskey[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPasskeyData = async () => {
      try {
        setLoading(true);
        const data = await fetch("/api/passkey/get-passkeys");
        const response = await data.json();
        if (response.success) {
          setPasskeys(response.passkeys);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPasskeyData();
  }, []);

  if (loading)
    return <Loader2 className="animate-spin w-10 h-10 mt-20 mx-auto" />;

  const handleDeletePasskey = async (passkeyId: string) => {
    try {
      setDeleteId(passkeyId);
      setDeleteLoading(true);
      const data = await fetch("/api/passkey/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passkeyId }),
      });
      const response = await data.json();
      if (response.success) {
        setPasskeys((prev) => prev.filter((p) => p._id !== passkeyId));
        return toast.success(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="mt-20 mx-60">
      <Table>
        <TableCaption>A list of your recent passkeys.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Device Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>CreatedAt</TableHead>
            <TableHead>Last UsedAt</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {passkeys?.map((passkey: IPasskey) => (
            <TableRow key={passkey._id}>
              <TableCell>{passkey.deviceInfo.deviceName}</TableCell>
              <TableCell>
                {passkey.status === "active" ? (
                  <Badge variant={"secondary"}>Active</Badge>
                ) : (
                  <Badge variant={"default"}>Inactive</Badge>
                )}
              </TableCell>
              <TableCell>
                {new Date(passkey.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(passkey.updatedAt).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                {deleteLoading && passkey._id === deleteId ? (
                  <Button disabled size={"sm"} variant="destructive">
                    <Loader2 className="mr-2 h-1 w-1 animate-spin" />
                    Wait...
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletePasskey(passkey._id)}
                  >
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Passkeys;
