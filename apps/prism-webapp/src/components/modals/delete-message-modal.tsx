"use client";

import React, { useState } from "react";
import axios from "axios";
import qs from "query-string";

import Modal from "@/components/solutions/Dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

export function DeleteMessageModal() {
  const {
    isOpen,
    onClose,
    type,
    data: { apiUrl, query }
  } = useModal();

  const isModalOpen = isOpen && type === "deleteMessage";

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query
      });

      await axios.delete(url);

      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isModalOpen} onClose={onClose} title="Delete Message">
      <p className="text-center text-sm text-zinc-500 mb-4">
        Are you sure you want to do this?
        <br />
        The message will be permanently deleted.
      </p>
      <div className="bg-gray-100 px-6 py-4 -mx-6 -mb-6 rounded-b-2xl flex items-center justify-between w-full">
        <Button variant="ghost" disabled={isLoading} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={isLoading}
          onClick={onClick}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
