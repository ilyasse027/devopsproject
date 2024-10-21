pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = "ilyassepro/devopsproject"
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }
    
    stages {
        stage('Clean Workspace') { // Ensures Jenkins starts fresh every time
            steps {
                deleteDir()
            }
        }
        
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Check Tools') {
            steps {
                bat 'java -version'
                script {
                    def mvnHome = tool name: 'Maven', type: 'maven'
                    bat "${mvnHome}/bin/mvn --version"
                }
                bat 'node --version'
                bat 'npm --version'
                bat 'docker --version'
                bat 'kubectl version --client'
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    withMaven(maven: 'Maven') { 
                        bat 'mvn clean package -DskipTests -U -X'
                    }
                    bat 'dir target'
                }
            }
        }
        
        stage('Test Backend') {
            steps {
                dir('backend') {
                    withMaven(maven: 'Maven') { 
                        bat 'mvn test'
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }
        
        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    bat 'dir src\\__tests__' // List test files for debugging
                    bat 'npm test -- --watchAll=false' // Simplified test command
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    bat "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    bat "docker login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD%"
                    bat "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    bat "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                bat "kubectl get nodes"
                bat "kubectl get pods"
                bat "kubectl set image deployment/myapp-deployment myapp-container=${DOCKER_IMAGE}:${DOCKER_TAG}"
                bat "kubectl rollout status deployment/myapp-deployment"
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            bat 'docker system prune -f'
        }
    }
}
