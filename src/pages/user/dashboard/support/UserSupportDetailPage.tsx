/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { FileUpload } from 'primereact/fileupload';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { useNavigate, useParams } from 'react-router-dom';

type TicketMessage = { sender: string; content: string; attachments?: string[] };

const UserSupportDetailPage = () => {
    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    const [messages, setMessages] = useState<TicketMessage[]>([
        {
            sender: 'Operator',
            content: 'Halo,\n\nBaik, apabila sudah lakukan verifikasi, harap Anda tunggu dan cek secara berkala sehingga sekolah akan aktif kembali nantinya.',
            attachments: [],
        },
        {
            sender: 'Owner',
            content: 'Halo,\n\nBaik, Terimakasih banyak',
            attachments: [],
        },
    ]);

    const [isReplyFormVisible, setReplyFormVisible] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    const handleSendMessage = () => {
        if (newMessage.trim() || uploadedFiles.length > 0) {
            const newMsg: TicketMessage = {
                sender: 'User',
                content: newMessage,
                attachments: uploadedFiles.map((file) => URL.createObjectURL(file)),
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
            setUploadedFiles([]);
            setReplyFormVisible(false);
        }
    };

    const handleFileUpload = (event: any) => {
        setUploadedFiles(event.files);
    };

    const customFileItemTemplate = (file: any, options: any) => (
        <div className="flex align-items-center justify-content-between p-2 border-round bg-gray-200">
            <div>{file.name}</div>
            <Button
                icon="pi pi-times"
                className="p-button-text p-button-danger"
                onClick={() => options.onRemove(file)}
            />
        </div>
    );

    return (
        <div className="p-4 card">
            <div className="flex justify-content-between align-items-center mb-4">
                <h3>Tiket #{id} - Permintaan Dukungan</h3>
                <Button onClick={() => {
                    navigate(-1);
                }} label="Kembali" icon="pi pi-arrow-left" className="p-button-secondary" />
            </div>

            <div className="mb-4">
                <h5>Detail Tiket</h5>
                <p>
                    <strong>Status:</strong> <Tag value="Dibuka" severity="success" />{' '}
                </p>
                <p>
                    <strong>Prioritas:</strong> <Tag value="Tinggi" severity="danger" />
                </p>
            </div>

            <Divider />

            {isReplyFormVisible && (
                <div className="mb-4 card">
                    <h4>Balas</h4>
                    <div className="p-fluid grid">
                        <div className="col-6">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value="nama"
                                readOnly
                                className="p-inputtext w-full"
                            />
                        </div>
                        <div className="col-6">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="text"
                                id="email"
                                value="emailsekolah@gmail.com"
                                readOnly
                                className="p-inputtext w-full"
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <label htmlFor="message">Message</label>
                        <InputTextarea
                            id="message"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            rows={4}
                            placeholder="Write your message here..."
                            className="w-full"
                        />
                    </div>
                    <div className="mt-3">
                        <label htmlFor="attachments">Attachments</label>
                        <FileUpload
                            name="attachments"
                            mode="advanced"
                            multiple
                            customUpload={true}
                            accept="image/*, .pdf"
                            maxFileSize={31457280}
                            onUpload={handleFileUpload}
                            itemTemplate={customFileItemTemplate}
                        />
                        <small className="text-gray-600">
                            Allowed File Extensions: jpg, jpeg, png, pdf. (Max size: 30MB)
                        </small>
                    </div>
                    <div className="mt-4 flex justify-content-end gap-2">
                        <Button
                            label="Submit"
                            icon="pi pi-check"
                            className="p-button-primary"
                            onClick={handleSendMessage}
                        />
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            className="p-button-secondary"
                            onClick={() => setReplyFormVisible(false)}
                        />
                    </div>
                </div>
            )}

            {!isReplyFormVisible && (
                <div className="flex justify-content-end mb-4 gap-2">
                    <Button
                        label="Reply"
                        icon="pi pi-reply"
                        className="p-button-primary"
                        onClick={() => setReplyFormVisible(true)}
                    />
                    <Button label="Tutup" icon="pi pi-times" className="p-button-danger" />
                </div>
            )}

            <div>
                {messages.map((msg, idx) => (
                    <div key={idx} className="mb-4 card">
                        <div className="flex align-items-center mb-2">
                            <span className="font-bold mr-2">
                                {msg.sender === 'User' ? 'You' : msg.sender}
                            </span>
                            <small className="text-gray-600">{new Date().toLocaleString()}</small>
                        </div>
                        <div className="p-3 border-round bg-gray-100 shadow-1">
                            <p style={{ whiteSpace: 'pre-line' }}>{msg.content}</p>
                            {msg.attachments && msg.attachments.length > 0 && (
                                <div className="mt-3">
                                    {msg.attachments.map((url, fileIdx) => (
                                        <a
                                            key={fileIdx}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mr-3 text-primary underline"
                                        >
                                            Attachment {fileIdx + 1}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserSupportDetailPage;
