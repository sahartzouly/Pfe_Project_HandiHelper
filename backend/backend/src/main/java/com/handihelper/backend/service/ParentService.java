package com.handihelper.backend.service;

import com.handihelper.backend.entity.User;
import com.handihelper.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ParentService {

    private final UserRepository userRepository;

    @Transactional
    public User lierProche(Long parentId, String emailProche) {
        User parent = userRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent non trouvé"));
        User proche = userRepository.findByEmail(emailProche)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec cet email"));
        proche.setParent(parent);
        return userRepository.save(proche);
    }

    public List<User> getProches(Long parentId) {
        return userRepository.findByParentId(parentId);
    }
}