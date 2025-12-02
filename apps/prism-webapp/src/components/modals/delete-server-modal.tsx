"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Modal from "@/components/solutions/Dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

export function DeleteServerModal() {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteServer";
  const { server } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/servers/${server?.id}`);

      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isModalOpen} onClose={onClose} title="Delete Server">
      <p className="text-center text-sm text-zinc-500 mb-4">
        Are you sure you want to do this?
        <br />
        <span className="font-semibold text-indigo-500">
          {server?.name}
        </span>{" "}
        will be permanently deleted.
      </p>
      <div className="bg-neutral-900 px-6 py-4 -mx-4 -mb-6 rounded-b-2xl flex items-center justify-evenly w-full">
        <Button
          className="bg-rose-500 text-white"
          disabled={isLoading}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button variant="primary" disabled={isLoading} onClick={onClick}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
