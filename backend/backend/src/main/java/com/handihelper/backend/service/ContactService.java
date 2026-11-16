package com.handihelper.backend.service;

import com.handihelper.backend.entity.Contact;
import com.handihelper.backend.entity.Profile;
import com.handihelper.backend.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final ProfileService profileService;

    public List<Contact> getContactsByProfile(Long profileId) {
        return contactRepository.findByProfileId(profileId);
    }

    public List<Contact> getUrgenceContacts(Long profileId) {
        return contactRepository.findByProfileIdAndEstUrgenceTrue(profileId);
    }

    @Transactional
    public Contact createContact(Long profileId, Contact contact) {
        Profile profile = profileService.getProfileById(profileId);
        contact.setProfile(profile);
        return contactRepository.save(contact);
    }

    @Transactional
    public Contact updateContact(Long contactId, Contact updatedContact) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() -> new RuntimeException("Contact non trouve"));
        if (updatedContact.getNom() != null)
            contact.setNom(updatedContact.getNom());
        if (updatedContact.getTelephone() != null)
            contact.setTelephone(updatedContact.getTelephone());
        if (updatedContact.getRelation() != null)
            contact.setRelation(updatedContact.getRelation());
        if (updatedContact.getPhotoUrl() != null)
            contact.setPhotoUrl(updatedContact.getPhotoUrl());
        if (updatedContact.getEstUrgence() != null)
            contact.setEstUrgence(updatedContact.getEstUrgence());
        return contactRepository.save(contact);
    }

    @Transactional
    public void deleteContact(Long contactId) {
        contactRepository.deleteById(contactId);
    }
}