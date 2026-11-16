package com.handihelper.backend.controller;

import com.handihelper.backend.dto.response.ApiResponse;
import com.handihelper.backend.entity.Contact;
import com.handihelper.backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @GetMapping("/{profileId}")
    public ResponseEntity<ApiResponse<List<Contact>>> getContacts(@PathVariable Long profileId) {
        List<Contact> contacts = contactService.getContactsByProfile(profileId);
        return ResponseEntity.ok(ApiResponse.success(contacts, "Contacts recuperes"));
    }

    @GetMapping("/{profileId}/urgence")
    public ResponseEntity<ApiResponse<List<Contact>>> getUrgenceContacts(@PathVariable Long profileId) {
        List<Contact> contacts = contactService.getUrgenceContacts(profileId);
        return ResponseEntity.ok(ApiResponse.success(contacts, "Contacts urgence recuperes"));
    }

    @PostMapping("/{profileId}")
    public ResponseEntity<ApiResponse<Contact>> createContact(
            @PathVariable Long profileId,
            @RequestBody Contact contact) {
        Contact created = contactService.createContact(profileId, contact);
        return ResponseEntity.ok(ApiResponse.success(created, "Contact cree"));
    }

    @PutMapping("/{contactId}")
    public ResponseEntity<ApiResponse<Contact>> updateContact(
            @PathVariable Long contactId,
            @RequestBody Contact contact) {
        Contact updated = contactService.updateContact(contactId, contact);
        return ResponseEntity.ok(ApiResponse.success(updated, "Contact mis a jour"));
    }

    @DeleteMapping("/{contactId}")
    public ResponseEntity<ApiResponse<Void>> deleteContact(@PathVariable Long contactId) {
        contactService.deleteContact(contactId);
        return ResponseEntity.ok(ApiResponse.success(null, "Contact supprime"));
    }
}