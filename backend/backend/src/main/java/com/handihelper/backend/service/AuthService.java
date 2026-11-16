package com.handihelper.backend.service;

import com.handihelper.backend.dto.request.LoginRequest;
import com.handihelper.backend.dto.request.RegisterRequest;
import com.handihelper.backend.dto.response.AuthResponse;
import com.handihelper.backend.entity.Profile;
import com.handihelper.backend.entity.User;
import com.handihelper.backend.enums.Role;
import com.handihelper.backend.exception.EmailAlreadyExistsException;
import com.handihelper.backend.repository.ProfileRepository;
import com.handihelper.backend.repository.UserRepository;
import com.handihelper.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Cet email est deja utilise");
        }

        User user = User.builder()
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();
        user = userRepository.save(user);

        Profile profile = Profile.builder()
                .user(user)
                .handicapType(request.getHandicapType())
                .langue("fr")
                .modeSombre(false)
                .taillePolice(16)
                .build();
        profile = profileRepository.save(profile);

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return buildAuthResponse(user, profile, accessToken, refreshToken);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouve"));

        Profile profile = profileRepository.findByUserId(user.getId()).orElse(null);

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return buildAuthResponse(user, profile, accessToken, refreshToken);
    }

    private AuthResponse buildAuthResponse(User user, Profile profile, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .role(user.getRole())
                .handicapType(profile != null ? profile.getHandicapType() : null)
                .profileId(profile != null ? profile.getId() : null)
                .build();
    }
}